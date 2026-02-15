import { Injectable } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ExceptionFactory } from '../Utils/Response/error.response';

const ErrorResponse = new ExceptionFactory();

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,

      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          path: error.property,
          errors: Object.values(error.constraints || {}),
        }));

        return ErrorResponse.badRequest({
          message: 'Validation failed',
          issus: formattedErrors,
        });
      },
    });
  }
}
