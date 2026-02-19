import { IsString } from 'class-validator';
import { IsMatch } from 'src/Common/Decorators/isMatch.decorator';
import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import {
  PickFromDtos,
  defineFields,
} from 'src/Common/Validation/generic-picker.validation';

const signupFields = defineFields([
  { source: BaseUserDto, name: 'fullName', isRequired: true },
  { source: BaseUserDto, name: 'email', isRequired: true },
  { source: BaseUserDto, name: 'password', isRequired: true },
  { source: BaseUserDto, name: 'gender', isRequired: true },
  { source: BaseUserDto, name: 'dateOfBirth', isRequired: true },
  { source: BaseUserDto, name: 'phoneNumber', isRequired: false },
  { source: BaseUserDto, name: 'userStatus', isRequired: false },
] as const);

export class SignupDto extends PickFromDtos(signupFields) {
  @IsString()
  @IsMatch('password')
  confirmPassword: string;
}
