import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./base.repository";
import { H_UserDocument, User } from "../Models/user.model";
import { Model, QueryOptions, Types } from "mongoose";
import { ExceptionFactory } from "src/Common/Utils/Response/error.response";
import { EncryptionService } from "src/Common/Utils/Security/encryption";

const ErrorResponse = new ExceptionFactory();


export class UserRepository extends DatabaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<H_UserDocument>,
    private readonly encryptionService: EncryptionService

  ) {
    super(model);
  }


  async findExistsUser(
    {
      filter,
      throwError = true
    }: {
      filter: { key: string, value: string | number | Date | Types.ObjectId }[],
      throwError?: boolean
    }
  ): Promise<H_UserDocument | null> {


    const userExists = await this.findOne({
      filter: {
        $or: filter.map((f) => ({
          [f.key]: this.encryptionService.encrypt(f.value as string)
        }))
      }
    });


    if (throwError && userExists) {

      const issus: { path: string, info: string }[] = []

      filter.forEach((f) => {
        issus.push({
          path: f.key,
          info: `User With ${f.key} already exists`
        })
      })


      throw ErrorResponse.conflict({
        message: 'User Already Exists',
        issus
      })


    }

    return userExists;


  }

  async findByEmail({
    email,
    select,
    options,
    getFreezed
  }: {
    email: string,
    select?: string | readonly string[] | Record<string, number | boolean | string | object>,
    options?: QueryOptions<User>,
    getFreezed?: boolean
  }) {


    return this.findOne({
      filter: {
        email: this.encryptionService.encrypt(email)
      }
      , select, options, getFreezed
    })

  }

}