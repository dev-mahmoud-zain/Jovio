import { UserDocument } from 'src/DATABASE';
import { OTP_TypeEnum } from '../enums';
import { compareHash, ExceptionFactory } from '../utils';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppHelpers {
  constructor(private readonly errorResponse: ExceptionFactory) {}

  async ValidateOTP(
    user: UserDocument,
    _Plain_OTP: string,
    OTP_Type: OTP_TypeEnum,
    error_message?: string,
  ):Promise<true> {

    // Check OTP Exists

    if (!error_message) {
      error_message = 'OTP Error';
    }

    if (!user.OTP_Code || user.OTP_Code.type !== OTP_Type) {
      throw this.errorResponse.badRequest({
        message: error_message,
        info: 'No Matched OTP Code Found. Please Request A New OTP Code for resetting your password.',
      });
    }

    // Check If OTP Is Expired
    if (user.OTP_Code.expiresAt < new Date()) {
      throw this.errorResponse.badRequest({
        message: error_message,
        info: 'Your OTP Code has expired. Please request a new OTP Code.',
      });
    }

    //Compare OTP With Plain Value

    if (!(await compareHash(_Plain_OTP, user.OTP_Code.code))) {
      throw this.errorResponse.badRequest({
        message: error_message,
        info: 'Invalid OTP Code. Please check the code sent to your email.',
      });
    }



    return true

  }




}