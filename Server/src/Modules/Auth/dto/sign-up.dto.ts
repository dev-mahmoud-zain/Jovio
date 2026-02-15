import { IsString } from 'class-validator';
import { IsMatch } from 'src/Common/Decorators/isMatch.decorator';
import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import {
  PickFromDtos,
  configField,
} from 'src/Common/Validation/generic-picker.validation';

const signupFields = [
  configField({ source: BaseUserDto, name: 'fullName', isRequired: true }),
  configField({ source: BaseUserDto, name: 'email', isRequired: true }),
  configField({ source: BaseUserDto, name: 'password', isRequired: true }),
  configField({ source: BaseUserDto, name: 'gender', isRequired: true }),
  configField({ source: BaseUserDto, name: 'dateOfBirth', isRequired: true }),
  configField({ source: BaseUserDto, name: 'phoneNumber', isRequired: false }),
  configField({ source: BaseUserDto, name: 'userStatus', isRequired: false }),
];

export class SignupDto extends PickFromDtos(signupFields) {
  @IsString()
  @IsMatch('password')
  confirmPassword: string;
}
