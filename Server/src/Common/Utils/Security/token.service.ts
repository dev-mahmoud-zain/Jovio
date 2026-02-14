import { JwtRepository } from 'src/Database/Repository/jwt.repository';
import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { RoleEnum } from 'src/Common/Enums/role.enum';
import jwt, { sign } from 'jsonwebtoken';
import { compareHash, generateHash } from './hash';
import { ExceptionFactory } from '../Response/error.response';
import { UserRepository } from 'src/Database/Repository/user.repository';
import { SecurityLoggerService } from 'src/Common/Middlewares/security.logger.service';
import { I_Session } from './client-info.service';
import {
  I_Decoded,
  I_SignToken,
  SignatureLevelEnum,
  TokenTypeEnum,
} from 'src/Common/Types/token.types';

const ErrorResponse = new ExceptionFactory();

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly userRepository: UserRepository,
    private readonly securityLogger: SecurityLoggerService,
  ) {}

  private detectSignatureFromToken(token: string) {
    return token.split(' ')[0] === SignatureLevelEnum.BEARER
      ? SignatureLevelEnum.BEARER
      : SignatureLevelEnum.SYSTEM;
  }

  private getSecretKey(
    signature: SignatureLevelEnum,
    tokenType: TokenTypeEnum,
  ): string {
    const isUser = signature === SignatureLevelEnum.BEARER;

    let key: string | undefined;

    if (isUser) {
      key =
        tokenType === TokenTypeEnum.ACCESS
          ? process.env.ACCESS_USER_TOKEN_SIGNATURE
          : process.env.REFRESH_USER_TOKEN_SIGNATURE;
    } else {
      key =
        tokenType === TokenTypeEnum.ACCESS
          ? process.env.ACCESS_SYSTEM_TOKEN_SIGNATURE
          : process.env.REFRESH_SYSTEM_TOKEN_SIGNATURE;
    }

    if (!key) {
      throw new Error(`Secret key for ${tokenType} is missing in .env`);
    }

    return key;
  }

  private async signToken(data: I_SignToken) {
    let SECRET_KEY: string = this.getSecretKey(data.signature, data.tokenType);

    const expiresIn = data.tokenType === TokenTypeEnum.ACCESS ? '1h' : '7d';

    const jti = crypto.randomUUID();

    return {
      token: sign(data.payload, SECRET_KEY, {
        expiresIn,
        jwtid: jti,
      }),
      jti,
    };
  }

  async createLoginCredentials(
    userId: Types.ObjectId | string,
    userRole: RoleEnum,
  ) {
    const signature =
      userRole === RoleEnum.USER
        ? SignatureLevelEnum.BEARER
        : SignatureLevelEnum.SYSTEM;

    const access_token = await this.signToken({
      payload: {
        userId,
        userRole,
      },
      tokenType: TokenTypeEnum.ACCESS,
      signature,
    });

    const refresh_token = await this.signToken({
      payload: {
        userId,
        userRole,
      },
      tokenType: TokenTypeEnum.REFRESH,
      signature,
    });

    return {
      access_token: {
        token: `${signature} ${access_token.token}`,
        jti: access_token.jti,
      },
      refresh_token: {
        token: `${signature} ${refresh_token.token}`,
        jti: refresh_token.jti,
      },
    };
  }

  async saveJwt(
    userId: Types.ObjectId,
    jti: string,
    token: string,
    type: TokenTypeEnum,
    session: I_Session,
  ) {
    const expiresAt =
      type === TokenTypeEnum.ACCESS
        ? new Date(Date.now() + 60 * 60 * 1000)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    this.jwtRepository.create({
      data: [
        {
          userId,
          token: await generateHash({ text: token }),
          type,
          jti,
          ipAddress: session.ipAddress,
          deviceInfo: session.deviceInfo,
          userAgent: session.userAgent,
          expiresAt,
        },
      ],
    });
  }

  private verifyToken = async (
    token: string,
    secretKey: string,
  ): Promise<I_Decoded> => {
    return jwt.verify(token, secretKey) as I_Decoded;
  };

  private async revokeAllTokensForUser(userId: Types.ObjectId) {
    await this.jwtRepository.updateMany({
      filter: {
        userId,
      },
      update: {
        revoked: true,
        revokedAt: new Date(),
      },
    });
  }

  async decodeToken(
    token: string,
    type: TokenTypeEnum,
    signature: SignatureLevelEnum,
  ) {
    const SECRET_KEY = this.getSecretKey(signature, type);

    let decoded: I_Decoded;

    if (token.startsWith('Bearer') || token.startsWith('Bearer')) {
      token = token.split(' ')[1];
    }

    try {
      decoded = await this.verifyToken(token, SECRET_KEY);
    } catch (error) {
      throw ErrorResponse.unauthorized({
        message: 'Fail To Decode Token',
        info: error.message,
      });
    }

    const [user, jwt] = await Promise.all([
      this.userRepository.findById({
        id: decoded.userId,
      }),

      this.jwtRepository.findOne({
        filter: {
          jti: decoded.jti,
        },
      }),
    ]);

    if (!user) {
      throw ErrorResponse.unauthorized({
        message: 'Fail To Find User',
      });
    }

    if (!jwt) {
      throw ErrorResponse.unauthorized({
        message: 'Invalid Or Old Credentials',
      });
    }

    if (jwt.type !== type) {
      throw ErrorResponse.unauthorized({
        message: 'Invalid token type',
      });
    }

    if (jwt.revoked) {
      throw ErrorResponse.unauthorized({
        message: 'Session expired, please login again',
      });
    }

    if (jwt.expiresAt < new Date()) {
      if (jwt.type === TokenTypeEnum.REFRESH) {
        throw ErrorResponse.unauthorized({
          message: 'Refresh token expired, please login again',
        });
      }

      throw ErrorResponse.unauthorized({
        message: 'Access token expired',
      });
    }

    if (
      !(await compareHash({
        plainText: `${signature} ${token}`,
        hashText: jwt.token,
      }))
    ) {
      await this.revokeAllTokensForUser(user!._id);

      this.securityLogger.warn('Refresh token reuse detected', {
        userId: user._id,
        jti: jwt.jti,
        tokenType: jwt.type,
      });

      throw ErrorResponse.unauthorized({
        message: 'Session expired, please login again',
      });
    }

    return { decoded, user };
  }

  async createRefreshToken(
    userId: Types.ObjectId,
    userRole: RoleEnum,
    signature: SignatureLevelEnum,
  ) {
    const access_token = await this.signToken({
      payload: {
        userId,
        userRole,
      },
      tokenType: TokenTypeEnum.ACCESS,
      signature,
    });

    return {
      token: `${signature} ${access_token.token}`,
      jti: access_token.jti,
    };
  }

  async revokeToken(token: string, type: TokenTypeEnum) {
    const signature = this.detectSignatureFromToken(token);

    const { decoded } = await this.decodeToken(token, type, signature);

    const jwt = await this.jwtRepository.updateOne({
      filter: {
        jti: decoded.jti,
        revoked: false,
      },
      update: {
        revoked: true,
        revokedAt: new Date(),
      },
    });

    if (!jwt.modifiedCount) {
      throw ErrorResponse.serverError({
        message: 'Fail To Revoke Token',
      });
    }
  }

  async getSessions(userId: Types.ObjectId) {
    return await this.jwtRepository.find({
      filter: {
        userId,
        revoked: false,
        type: TokenTypeEnum.REFRESH,
      },
      projection: {
        deviceInfo: 1,
        ipAddress: 1,
        userAgent: 1,
        jti: 1,
      },
      options: {
        lean: true,
      },
    });
  }

  async revokeSession(
    sessionId: Types.ObjectId,
    currentJti: string,
  ): Promise<'eq' | 'ne'> {
    const jwt = await this.jwtRepository.findOne({
      filter: {
        _id: sessionId,
        revoked: false,
      },
    });

    if (!jwt) {
      throw ErrorResponse.badRequest({
        message: 'Not Active Session With This Id: ' + sessionId,
      });
    }

    jwt.revoked = true;
    jwt.revokedAt = new Date();

    await jwt.save();

    if (jwt.jti === currentJti) {
      return 'eq';
    } else {
      return 'ne';
    }
  }
}
