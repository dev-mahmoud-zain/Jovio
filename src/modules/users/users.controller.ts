import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Auth, fileValidation, Public, TokenTypeEnum } from 'src/common';
import type { IRequest } from 'src/common';
import { Types } from 'mongoose';
import { UserDocument } from 'src/DATABASE';
import {
  ConfirmUpdateEmailDto,
  UpdateEmailDto,
  UpdatePasswordDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { cloudFileUpload } from 'src/common/utils/multer/cloud.multer.options';
import { GetUserByIdParamDto } from './dto/get-user.dto';
import { FreezeAccountDto, RestoreAccountDto } from './dto/freeze-account.dto';

@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    stopAtFirstError: true,
  }),
)
@Auth([], TokenTypeEnum.access)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ================================== Profile Management ==================================

  // ====> Update User Basic Info [ userName ,phone, gender, dateOfBirth ,status]

  @Patch('update-data')
  updateUserData(@Req() req: IRequest, @Body() body: UpdateUserDto) {
    return this.usersService.updateUserData(
      req.credentials?.user._id as Types.ObjectId,
      body,
    );
  }

  // ====> Request To Update User Email

  @Post('update-email')
  updateEmail(@Req() req: IRequest, @Body() body: UpdateEmailDto) {
    return this.usersService.updateEmail(
      req.credentials?.user._id as Types.ObjectId,
      body,
    );
  }

  // ====> Confirm The Request To Update User Email

  @Put('confirm-update-email')
  confirmUpdateEmail(
    @Req() req: IRequest,
    @Body() body: ConfirmUpdateEmailDto,
  ) {
    return this.usersService.confirmUpdateEmail(
      req.credentials?.user as UserDocument,
      body.OTP_Code,
    );
  }

  // ====> Update User Password

  @Put('update-password')
  updatePassword(@Req() req: IRequest, @Body() body: UpdatePasswordDto) {
    return this.usersService.updatePassword(
      req.credentials?.user as UserDocument,
      body.password,
      body.newPassword,
    );
  }

  // ====> Upload Profile Picture
  @UseInterceptors(
    FileInterceptor(
      'image',
      cloudFileUpload({
        validation: fileValidation.image,
      }),
    ),
  )
  @Post('upload-profile-picture')
  uploadProfilePicture(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: IRequest,
  ) {
    return this.usersService.uploadProfilePictureOrCover(
      file,
      req.credentials?.user._id as Types.ObjectId,
      'profile-pictures',
    );
  }

  // ====> Upload Profile Picture
  @UseInterceptors(
    FileInterceptor(
      'image',
      cloudFileUpload({
        validation: fileValidation.image,
      }),
    ),
  )
  @Post('upload-profile-cover')
  uploadProfileCover(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: IRequest,
  ) {
    return this.usersService.uploadProfilePictureOrCover(
      file,
      req.credentials?.user._id as Types.ObjectId,
      'cover-images',
    );
  }

  // ====> Delete Image From User Profile

  @Delete('delete-profile-picture')
  deleteImage(@Req() req: IRequest, @Query('public_id') imageId?: string) {
    return this.usersService.deleteImage(
      req.credentials?.user as UserDocument,
      imageId,
    );
  }

  // ====> Freeze My Account
  @Delete('freeze-my-account')
  freezeAccount(@Req() req: IRequest, @Body() body: FreezeAccountDto) {
    return this.usersService.freezeAccount(
      req.credentials?.user._id as Types.ObjectId,
      req.credentials?.user as UserDocument,
      body.password,
    );
  }

  // ====> Restore My Account

  @Public() // To Make Exception From Authentication Guard
  @Patch('restore-my-account')
  restoreAccount(@Req() req: IRequest, @Body() body: RestoreAccountDto) {
    return this.usersService.restoreAccount(
      body.email,
      body.password,
    );
  }

  // ================================== Users Retrieval ==================================

  // ====> Get Login User Profile

  @Get('profile')
  profile(@Req() req: IRequest) {
    return this.usersService.profile(req.credentials?.user as UserDocument);
  }

  // ====> Get User By Id
  @Get(':_id')
  getUserById(@Req() req: IRequest, @Param() param: GetUserByIdParamDto) {
    return this.usersService.getUserById(param._id as Types.ObjectId);
  }
}
