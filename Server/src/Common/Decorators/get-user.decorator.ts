import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { I_Request } from 'src/Common/Interfaces/request.interface';

export const GetUserCredentials = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as I_Request;
    const credentials = request.credentials;

    return data ? credentials?.[data] : credentials;
  },
);
