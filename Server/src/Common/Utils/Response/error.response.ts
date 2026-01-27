import { BadRequestException, ConflictException, ForbiddenException, HttpStatus, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";

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

    return error;
  }

  badRequest(options: ExceptionOptions = {}) {
    return new BadRequestException(
      this.createPayload('BadRequestException', HttpStatus.BAD_REQUEST, options),
    );
  }

  serverError(options: ExceptionOptions = {}) {
    return new InternalServerErrorException(
      this.createPayload('InternalServerErrorException', HttpStatus.INTERNAL_SERVER_ERROR, options),
    );
  }

  notFound(options: ExceptionOptions = {}) {
    return new NotFoundException(
      this.createPayload('NotFoundException', HttpStatus.NOT_FOUND, options),
    );
  }

  forbidden(options: ExceptionOptions = {}) {
    return new ForbiddenException(
      this.createPayload('ForbiddenException', HttpStatus.FORBIDDEN, options),
    );
  }

  conflict(options: ExceptionOptions = {}) {
    return new ConflictException(
      this.createPayload('ConflictException', HttpStatus.CONFLICT, options),
    );
  }

  unauthorized(options: ExceptionOptions = {}) {
    return new UnauthorizedException(
      this.createPayload('UnauthorizedException', HttpStatus.UNAUTHORIZED, options),
    );
  }


}