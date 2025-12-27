import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models';
import { DatabaseRepository } from './database.repository';
import {
  Model,
  ProjectionType,
  QueryOptions,
  RootFilterQuery,
  Types,
} from 'mongoose';
import { NotFoundException } from '@nestjs/common';

export class UserRepository extends DatabaseRepository<User> {
  constructor(
    @InjectModel(User.name)
    protected override readonly model: Model<UserDocument>,
  ) {
    super(model);
  }

  getUser = async ({
    filter,
    select,
    options,
    error,
  }: {
    filter?: RootFilterQuery<UserDocument>;
    select?: ProjectionType<UserDocument> | null;
    options?: (QueryOptions<UserDocument> & { populate?: any }) | null;

    error?: {
      message?: string;
      info?: string;
    };
  }): Promise<UserDocument> => {
    const user = (await this.findOne({
      filter,
      options,
      select,
    })) as UserDocument;

    if (!user) {
      let message = error?.message || 'User Not Found';
      let info = error?.info || `Fail To Find User Matched With Input Query`;

      if (!error?.info) {
        if (Object.prototype.hasOwnProperty.call(filter ?? {}, 'email')) {
          info = 'No User Found With This Email';
        }
        if (Object.prototype.hasOwnProperty.call(filter ?? {}, '_id')) {
            info = 'No User Found With This Id';
        }
      }


      throw new NotFoundException({
        name:"NotFoundException",
        statusCode: 404,
        message,
        info,
      });


    }

    return user;
  };

  getProfile = async (_id: Types.ObjectId) => {
    const user: UserDocument = await this.getUser({
      filter: {
        _id,
      },
      select:
        '-password -createdAt -updatedAt -emailConfirmedAt -provider ',
    });
    return user;
  };
}