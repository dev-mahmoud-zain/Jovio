import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces';

export const SuccessResponse = <T = any>({
  message = 'done',
  info,
  statusCode = 200,
  data,
}: IResponse<T> = {}): IResponse<T> => {
  return { message, info, statusCode, data };
};


// ============================================================

interface ExceptionOptions {
  message?: string;
  issus?: { path?: string; info?: string }[];
  info?: string;
}

export class ExceptionFactory {
  private createPayload(
    name: string,
    statusCode: number,
    options: ExceptionOptions,
  ) {
    const error = {
      name,
      statusCode,
      message: options.message || name,
      info: options.info,
      issus: options.issus,
    };

    console.error(error);

    return error;
  }

  badRequest(options: ExceptionOptions = {}) {
    return new BadRequestException(
      this.createPayload('BadRequestException', 400, options),
    );
  }

  serverError(options: ExceptionOptions = {}) {
    return new InternalServerErrorException(
      this.createPayload('InternalServerErrorException', 500, options),
    );
  }

  notFound(options: ExceptionOptions = {}) {
    return new NotFoundException(
      this.createPayload('NotFoundException', 404, options),
    );
  }
}
