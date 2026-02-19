import { IsString, Matches } from 'class-validator';
import { IsMatch } from 'src/Common/Decorators/isMatch.decorator';
import { UserDefinitions } from 'src/Modules/Users/Definitions/user.definitions';
import { UserErrors } from 'src/Modules/Users/Errors/user.error';

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @Matches(UserDefinitions.REGEX.PASSWORD, {
    message: UserErrors.PASSWORD,
  })
  newPassword: string;

  @IsMatch('newPassword')
  confirmNewPassword: string;
}
