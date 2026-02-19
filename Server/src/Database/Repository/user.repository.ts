import { InjectModel } from '@nestjs/mongoose';
import { DatabaseRepository } from './base.repository';
import { H_UserDocument, User } from '../Models/user.model';
import { Model, QueryOptions, Types } from 'mongoose';
import { ExceptionFactory } from 'src/Common/Utils/Response/error.response';
import { EncryptionService } from 'src/Common/Utils/Security/encryption';

const ErrorResponse = new ExceptionFactory();

export class UserRepository extends DatabaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<H_UserDocument>,
    private readonly encryptionService: EncryptionService,

  ) {
    super(model);
  }

  async findExistsUser({
    filter,
    throwError = true,
  }: {
    filter: { key: string; value: string | number | Date | Types.ObjectId }[];
    throwError?: boolean;
  }): Promise<H_UserDocument | null> {
    const userExists = await this.findOne({
      filter: {
        $or: filter.map((f) => ({
          [f.key]: this.encryptionService.encrypt(f.value as string),
        })),
      },
    });

    if (throwError && userExists) {
      const issues: { path: string; info: string }[] = [];

      filter.forEach((f) => {
        issues.push({
          path: f.key,
          info: `User With ${f.key} already exists`,
        });
      });

      throw ErrorResponse.conflict({
        message: 'User Already Exists',
        issues,
      });
    }

    return userExists;
  }

  async findByEmail({
    email,
    select,
    options,
    getFreezed,
  }: {
    email: string;
    select?:
    | string
    | readonly string[]
    | Record<string, number | boolean | string | object>;
    options?: QueryOptions<User>;
    getFreezed?: boolean;
  }) {
    return this.findOne({
      filter: {
        email: this.encryptionService.encrypt(email),
      },
      select,
      options,
      getFreezed,
    });
  }

  async findByPhone({
    phone,
    select,
    options,
    getFreezed,
  }: {
    phone: string;
    select?:
    | string
    | readonly string[]
    | Record<string, number | boolean | string | object>;
    options?: QueryOptions<User>;
    getFreezed?: boolean;
  }) {
    return this.findOne({
      filter: {
        phone: this.encryptionService.encrypt(phone),
      },
      select,
      options,
      getFreezed,
    });
  }


  async deleteUser(userId: string | Types.ObjectId): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(userId, {
      isDeleted: true,
    });
    return !!result;
  }

  async updateUser({
    id,
    updateData,
    options = { new: true },
  }: {
    id: string | Types.ObjectId;
    updateData: Partial<User>;
    options?: QueryOptions<User>;
  }): Promise<H_UserDocument> {
    const sensitiveFields = ['email', 'phoneNumber'];
    const encryptedData = { ...updateData };

    for (const key of sensitiveFields) {
      if (encryptedData[key])
        encryptedData[key] = this.encryptionService.encrypt(encryptedData[key]);
    }

    const updatedUser = await this.model.findByIdAndUpdate(
      id,
      { $set: encryptedData },
      options,
    );

    if (!updatedUser)
      throw ErrorResponse.notFound({
        message: 'User not found',
        issues: [{ path: 'id', info: 'No user exists with the provided ID' }],
      });

    return updatedUser;
  }
}
