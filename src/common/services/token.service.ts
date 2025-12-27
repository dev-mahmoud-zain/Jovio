import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from '../enums';
import {
  IGenerateToken,
  IVerifyToken,
  SignatureLevelEnum,
  TokenTypeEnum,
} from '../enums/token.enums';
import {
  TokenDocument,
  TokenRepository,
  UserDocument,
  UserRepository,
} from 'src/DATABASE';
import { randomUUID } from 'crypto';
import { JwtPayload } from 'jsonwebtoken';
import { decrypt } from '../utils';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  private detectSignatureLevel = async (
    role: RoleEnum = RoleEnum.user,
  ): Promise<SignatureLevelEnum> => {
    let SignatureLevel: SignatureLevelEnum = SignatureLevelEnum.Bearer;

    switch (role) {
      case RoleEnum.admin:
      case RoleEnum.super_admin:
        SignatureLevel = SignatureLevelEnum.System;
        break;
      default:
        SignatureLevel = SignatureLevelEnum.Bearer;
        break;
    }
    return SignatureLevel;
  };

  private getSignatures = async (
    signatureLevel: SignatureLevelEnum = SignatureLevelEnum.Bearer,
  ): Promise<{ access_signature: string; refresh_signature: string }> => {
    let signatures: { access_signature: string; refresh_signature: string } = {
      access_signature: '',
      refresh_signature: '',
    };

    switch (signatureLevel) {
      case SignatureLevelEnum.System:
        signatures.access_signature = process.env
          .ACCESS_SYSTEM_TOKEN_SIGNATURE as string;
        signatures.refresh_signature = process.env
          .REFRESH_SYSTEM_TOKEN_SIGNATURE as string;
        break;
      default:
        signatures.access_signature = process.env
          .ACCESS_USER_TOKEN_SIGNATURE as string;
        signatures.refresh_signature = process.env
          .REFRESH_USER_TOKEN_SIGNATURE as string;
        break;
    }

    return signatures;
  };

  private generateToken = async ({
    payload,
    options = {
      secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
      expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_TIME as string),
    },
  }: IGenerateToken) => {
    return await this.jwtService.signAsync(payload, options);
  };

  private verifyToken = async ({
    token,
    options = {
      secret: process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
    },
  }: IVerifyToken) => {
    return await this.jwtService.verifyAsync(token, options);
  };

  createLoginCredentials = async (
    user: UserDocument,
  ): Promise<{ access_token: string; refresh_token: string }> => {


    const signatureLevel = await this.detectSignatureLevel(user.role);
    const signatures = await this.getSignatures(signatureLevel);

    const jwtid = randomUUID();

    const expiresIn = process.env.NODE_ENV === 'development' ? '1d' : '1h';

    let access_token = await this.generateToken({
      payload: { _id: user._id, role: user.role },
      options: {
        secret: signatures.access_signature,
        expiresIn,
        jwtid,
      },
    });

    let refresh_token = await this.generateToken({
      payload: { _id: user._id, role: user.role },
      options: {
        secret: signatures.refresh_signature,
        expiresIn: '1w',
        jwtid,
      },
    });

    access_token =
      user.role === RoleEnum.user
        ? `Bearer ${access_token}`
        : `System ${access_token}`;

    refresh_token =
      user.role === RoleEnum.user
        ? `Bearer ${refresh_token}`
        : `System ${refresh_token}`;

    return { access_token, refresh_token };
  };

  decodeToken = async ({
    authorization,
    tokenType = TokenTypeEnum.access,
  }: {
    authorization: string;
    tokenType: TokenTypeEnum;
  }) => {
    try {
      const [bearerKey, token] = authorization.split(' ');



      if (!bearerKey || !token) {
        throw new UnauthorizedException(
          'Token is missing required parts: [Bearer/System Key, Token]',
        );
      }

      if (
        bearerKey !== SignatureLevelEnum.Bearer &&
        bearerKey !== SignatureLevelEnum.System
      ) {
        throw new BadRequestException(
          'Bearer Key Is Only Valid On: [Bearer / System]',
        );
      }

      const signatures = await this.getSignatures(
        bearerKey as SignatureLevelEnum,
      );

      const decoded = await this.verifyToken({
        token,
        options: {
          secret:
            tokenType === TokenTypeEnum.access
              ? signatures.access_signature
              : signatures.refresh_signature,
        },
      });

      if (!decoded?._id || !decoded?.iat) {
        throw new BadRequestException('Invalid Token Payload');
      }

      if (
        await this.tokenRepository.findOne({
          filter: {
            jti: decoded?.jti,
          },
        })
      ) {
        throw new UnauthorizedException('Invalid Or Old Credentials');
      }

      const user = (await this.userRepository.findOne({
        filter: {
          _id: decoded._id,
          emailConfirmedAt: { $exists: true },
        },
        options: {
          lean: true,
        },
      })) as UserDocument;

      if (!user) {
        throw new BadRequestException('Not Registered Account');
      }

      if (
        (user.changeCredentialsTime?.getTime() || 0) - 1000 >
        decoded.iat * 1000
      ) {
        throw new UnauthorizedException('Invalid Or Old Credentials');
      }

      if(user.phone){
        user.phone = decrypt(user.phone);
      }
      return { decoded, user };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Some Thing Went Wrong',
      );
    }
  };

  createRevokeToken = async (
    tokenDecoded: JwtPayload,
  ): Promise<TokenDocument> => {
    const [result] =
      (await this.tokenRepository.create({
        data: [
          {
            jti: tokenDecoded.jti as string,
            expiresAt: new Date(
              (tokenDecoded.iat as number) + 60 * 60 * 24 * 365,
            ),
            createdBy: tokenDecoded._id,
          },
        ],
      })) || [];

    if (!result) {
      throw new BadRequestException('Fail To Revoke Token');
    }
    

    return result;
  };
}