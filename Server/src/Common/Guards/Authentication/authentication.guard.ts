import { I_Decoded, SignatureLevelEnum, TokenService, TokenTypeEnum } from 'src/Common/Utils/Security/token.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ExceptionFactory } from 'src/Common/Utils/Response/error.response';
import { User } from 'src/Database/Models/user.model';
import { Reflector } from '@nestjs/core';
import { I_Request } from 'src/Common/Interfaces/request.interface';

const ErrorResponse = new ExceptionFactory();


@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private readonly tokenService: TokenService,
    private readonly reflector: Reflector
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    let req: I_Request;
    let auth: string[] = [];

    const tokenType = this.reflector.getAllAndOverride<TokenTypeEnum>("tokenType", [
      context.getHandler(),
      context.getClass()
    ]) || TokenTypeEnum.ACCESS

    switch (context.getType()) {
      case "http":


        req = context.switchToHttp().getRequest() as I_Request;

        if (tokenType === TokenTypeEnum.REFRESH) {
          auth = req.cookies.refresh_token.split(" ");
        }

        else {
          auth = req.cookies.access_token.split(" ");
        }

        break;

      /*      case "ws":
     
             break; */



      default:
        break;
    }


    const signatureLevel = auth[0] === SignatureLevelEnum.BEARER ? SignatureLevelEnum.BEARER : SignatureLevelEnum.SYSTEM

    let data: {
      decoded: I_Decoded
      user: User
    }

    try {
      data = await this.tokenService.decodeToken(auth[1], tokenType, signatureLevel);
    } catch (error) {
      throw ErrorResponse.unauthorized({
        message: error.message
      })
    }


    req!.credentials = data;

    return true;
  }
}