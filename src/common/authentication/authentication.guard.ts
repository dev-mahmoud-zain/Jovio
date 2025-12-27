import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenTypeEnum } from 'src/common/enums/token.enums';
import { TokenService } from 'src/common/services/token.service';
import { IS_PUBLIC } from '../decorators/public.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const tokenType =
      this.reflector.getAllAndOverride('tokenType', [context.getHandler()]) ||
      TokenTypeEnum.access;

    let authorization = '';
    let req: any;



    switch (context.getType()) {
      case 'http':
        req = context.switchToHttp().getRequest();

        if (tokenType === TokenTypeEnum.access) {
          authorization = req.cookies?.access_token;
        } else if (tokenType === TokenTypeEnum.refresh) {
          authorization = req.cookies?.refresh_token;
        }

        break;

      case 'ws':
        // إعدادات WebSocket (لو محتاجها بعدين)
        break;

      default:
        break;
    }


    if (!authorization) {
      throw new ForbiddenException('Missing Authorization Key');
    }



    const { decoded, user } = await this.tokenService.decodeToken({
      authorization,
      tokenType,
    });

    
    

    req.credentials = { decoded, user };


    return true;
  }
}
