import { ExceptionFactory } from "src/Common/Utils/Response/error.response";
import { DatabaseRepository } from "./base.repository";
import { H_OtpDocument, OTP } from "../Models/otp.model";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


const ErrorResponse = new ExceptionFactory();

export class OtpRepository extends DatabaseRepository<OTP> {
  constructor(
    @InjectModel(OTP.name)
    protected override readonly model: Model<H_OtpDocument>,

  ) {
    super(model);
  }



}