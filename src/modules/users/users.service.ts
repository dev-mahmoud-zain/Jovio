import { Injectable } from '@nestjs/common';
import {
  compareHash,
  emailEvent,
  EmailEventsEnum,
  ExceptionFactory,
  generateHash,
  generateOTP,
  OTP_TypeEnum,
  SuccessResponse,
  TokenService,
} from 'src/common';
import { UserDocument, UserRepository } from 'src/DATABASE';
import { Types } from 'mongoose';
import { UpdateEmailDto, UpdateUserDto } from './dto/update-user.dto';
import { AppHelpers } from 'src/common/helpers/users.helpers';
import {
  deleteImageFromCloudinary,
  uploadToCloudinary,
} from 'src/common/utils/cloudinary';

@Injectable()
export class UsersService {
  constructor(
    private readonly userModel: UserRepository,
    private readonly errorResponse: ExceptionFactory,
    private readonly appHelpers: AppHelpers,
    private readonly tokenService: TokenService,
  ) {}

  // ================================== Profile Management ==================================

  // ====> Update User Basic Info [ userName ,phone, gender, dateOfBirth ,status]

  async updateUserData(_id: Types.ObjectId, body: UpdateUserDto) {
    const message = 'Fail To Update Your Data';

    if (Object.keys(body).length === 0) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'body',
            info: '',
          },
        ],
      });
    }

    const user = await this.userModel.findOneAndUpdate({
      filter: {
        _id,
      },
      updateData: {
        ...body,
      },
      options: {
        projection: {
          changeCredentialsTime: false,
          password: false,
          createdAt: false,
          updatedAt: false,
          emailConfirmedAt: false,
          provider: false,
          __v: false,
        },
      },
    });

    return SuccessResponse({
      info: 'Your Data Updated Successfully',
      data: {
        user,
      },
    });
  }

  // ====> Request To Update User Email
  async updateEmail(_id: Types.ObjectId, data: UpdateEmailDto) {
    const message = 'Fail To Update Your Email';

    // Check If Email Used
    if (
      await this.userModel.findOne({
        filter: {
          email: data.email,
        },
      })
    ) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'email',
            info: 'This Email Already Is Used Before',
          },
        ],
      });
    }

    const user = await this.userModel.findOne({
      filter: {
        _id,
      },
      select: '_id email password',
    });

    if (!(await compareHash(data.password, user!.password))) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'password',
            info: 'Invalid Password',
          },
        ],
      });
    }

    if (user?.OTP_Code?.type === OTP_TypeEnum.update_Email) {
      throw this.errorResponse.badRequest({
        message,
        info: 'You Already Ask To Change Email , Please Confirm It',
      });
    }

    const _Plain_OTP = generateOTP();

    this.userModel.updateOne(
      {
        _id,
      },
      {
        $set: {
          newEmail: data.email,
          OTP_Code: {
            code: await generateHash(_Plain_OTP),
            type: OTP_TypeEnum.update_Email,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
          },
        },
      },
    );

    emailEvent.emit(EmailEventsEnum.update_Email, {
      to: data.email,
      OTP_Code: _Plain_OTP,
    });

    return SuccessResponse({
      info: 'OTP Code Sent To Your New Email , Please Confirm It',
    });
  }

  // ====> Confirm The Request To Update User Email

  async confirmUpdateEmail(user: UserDocument, OTP_Code: string) {
    const message = 'Fail To Update Your Email';

    if (!user.newEmail) {
      throw this.errorResponse.badRequest({
        message,
        info: 'No email update request found. Please submit a new request to proceed',
      });
    }

    await this.appHelpers.ValidateOTP(
      user,
      OTP_Code,
      OTP_TypeEnum.update_Email,
      message,
    );

    this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          email: user.newEmail,
        },
        $unset: {
          newEmail: true,
          OTP_Block_ExpiresAt: true,
          OTP_Code: true,
          OTP_Count: true,
        },
      },
    );

    return SuccessResponse({
      info: 'Your Email Address Updates Successfully',
    });
  }

  // ====> Update User Password
  async updatePassword(
    user: UserDocument,
    oldPassword: string,
    newPassword: string,
  ) {
    const message = 'Fail To Update Your Password';

    if (!(await compareHash(oldPassword, user.password))) {
      throw this.errorResponse.badRequest({
        message,
        info: 'The Old Password You Entered Is Incorrect',
      });
    }

    this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: { password: newPassword },
      },
    );

    return SuccessResponse({
      info: 'Your Email Address Updates Successfully',
    });
  }

  // ====> Upload Or Update Profile Picture Or Cover

  async uploadProfilePictureOrCover(
    file: Express.Multer.File,
    userId: Types.ObjectId,
    folder: 'profile-pictures' | 'cover-images',
  ) {
    const message = 'Fail To Upload Your Picture';

    if (!file) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'image',
            info: 'Please Provide An Image',
          },
        ],
      });
    }

    const { secure_url, public_id } = await uploadToCloudinary(
      file,
      `Jovio/users/${userId}/${folder}/`,
    );

    if (!secure_url || !public_id) {
      throw this.errorResponse.badRequest({
        message,
        info: 'Fail To Upload Image To Cloud',
      });
    }

    const user = (await this.userModel.findOne({
      filter: {
        _id: userId,
      },
    })) as UserDocument;

    if (folder === 'profile-pictures') {
      user.profilePicture = {
        public_id,
        url: secure_url,
      };
      user.profilePictures?.push({ public_id, url: secure_url });
    }

    if (folder === 'cover-images') {
      user.coverPicture = {
        public_id,
        url: secure_url,
      };
      user.coverPictures?.push({ public_id, url: secure_url });
    }

    await user.save();

    return SuccessResponse({
      info: 'Your Image Upload Successfully',
      data: {
        url: secure_url,
      },
    });
  }

  // ===> Delete Image From User Profile

  async deleteImage(user: UserDocument, publicId?: string) {
    const message = 'Fail To Delete Picture';

    // ================
    // 1) بدون publicId
    // ================
    if (!publicId) {
      if (!user.profilePicture) {
        throw this.errorResponse.badRequest({
          message,
          info: 'No Profile Picture Reached',
        });
      }

      await this.userModel.updateOne(
        { _id: user._id },
        {
          $unset: { profilePicture: true },
          $pull: {
            profilePictures: { public_id: user.profilePicture.public_id },
          },
        },
      );

      deleteImageFromCloudinary(user.profilePicture.public_id);

      return SuccessResponse({ info: 'Image Deleted Successfully' });
    }

    const exists = user.profilePictures?.some(
      (img) => img.public_id === publicId,
    );

    if (!exists) {
      throw this.errorResponse.badRequest({
        message,
        info: 'No Image Found With This Public ID',
      });
    }

    // الصورة الأساسية؟
    const isMain = user.profilePicture?.public_id === publicId;

    if (isMain) {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $unset: { profilePicture: true },
          $pull: { profilePictures: { public_id: publicId } },
        },
      );
    } else {
      await this.userModel.updateOne(
        { _id: user._id },
        {
          $pull: { profilePictures: { public_id: publicId } },
        },
      );
    }

    if (publicId) deleteImageFromCloudinary(publicId);

    return SuccessResponse({
      info: 'Image Deleted Successfully',
    });
  }

  // ====> Freeze Account

  async freezeAccount(
    userId: Types.ObjectId,
    freezedBy: UserDocument,
    password: string,
  ) {
    const message = 'Fail To Freeze Account';

    if (!(await compareHash(password, freezedBy.password))) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'password',
            info: 'Password Is Incorrect',
          },
        ],
      });
    }

    const user = await this.userModel.updateOne(
      {
        _id: userId,
      },
      {
        $set: {
          freezedBy: freezedBy._id,
        },
      },
    );

    if (!user.modifiedCount) {
      throw this.errorResponse.badRequest({
        message,
        info: 'Fail To Find Matched User',
      });
    }

    return SuccessResponse({
      info: 'Account Freezed Successfully',
    });
  }

  // ====> Freeze Account

  async restoreAccount(email: string, password: string) {
    const message = 'Fail To Restore Account';

    const user = await this.userModel.findOne({
      filter: {
        email,
      },
      pranoId: true,
    });

    if (!user) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'email',
            info: `Fail To Find User With Email ${email}`,
          },
        ],
      });
    }

    if (!user.freezedAt || !user.freezedBy) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'email',
            info: `This Email Belongs To An Active Account And Cannot Be Restored.`,
          },
        ],
      });
    }

    if (!(await compareHash(password, user.password))) {
      throw this.errorResponse.badRequest({
        message,
        issus: [
          {
            path: 'password',
            info: 'Password Is Incorrect',
          },
        ],
      });
    }

    const restoreAccount = await this.userModel.updateOne(
      {
        _id: user._id,
      },
      {
        $set: {
          restoredBy: user._id,
        },
        $unset: {
          freezedAt: true,
          freezedBy: true,
        },
      },
      {
        pranoId: true,
      },
    );

    if (!restoreAccount.modifiedCount) {
      throw this.errorResponse.serverError({
        message,
      });
    }

    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );

    return SuccessResponse({
      info: 'Account Restored Successfully',
      data: {
        credentials,
      },
    });
  }

  // ================================== Users Retrieval ==================================

  // ====> Get Login User Profile
  async profile(user: UserDocument) {
    // هنا هيعمل decode للـ phone بـ  mongoose hooks
    // مش مستاهلة أبعت ريكوست تاني للداتا بيز

    const data = await this.userModel.getProfile(user._id);

    // هنا مش mongoose hooks
    // بس توفير ريكوست رايح للداتا بيز

    // const {
    //   password,
    //   __v,
    //   emailConfirmedAt,
    //   createdAt,
    //   updatedAt,
    //   changeCredentialsTime,
    //   provider,
    //   ...data
    // } = user;

    return SuccessResponse({
      data: {
        user: data,
      },
    });
  }

  // ====> Get User By Id

  async getUserById(_id: Types.ObjectId) {
    const message = 'Fail To Get User';

    const user = await this.userModel.findOne({
      filter: {
        _id,
      },
      select:
        '-password -createdAt -updatedAt -emailConfirmedAt -changeCredentialsTime -OTP_Code',
    });

    if (!user) {
      throw this.errorResponse.badRequest({
        message,
        info: `Cannot Find Matched User With Id : ${_id}`,
      });
    }

    console.log('ss');

    return SuccessResponse({
      data: {
        user,
      },
    });
  }
}