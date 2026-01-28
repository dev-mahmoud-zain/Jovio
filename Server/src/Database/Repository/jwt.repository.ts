import { ExceptionFactory } from "src/Common/Utils/Response/error.response";
import { DatabaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { H_JwtDocument, Jwt } from "../Models/jwt.model";


const ErrorResponse = new ExceptionFactory();

export class JwtRepository extends DatabaseRepository<Jwt> {
  constructor(
    @InjectModel(Jwt.name)
    protected override readonly model: Model<H_JwtDocument>,

  ) {
    super(model);
  }



}