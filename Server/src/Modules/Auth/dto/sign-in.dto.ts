import { IsString, MinLength } from 'class-validator';
import { BaseUserDto } from 'src/Modules/Users/dto/base-user.dto';
import {
  PickFromDtos,
  defineFields,
} from 'src/Common/Validation/generic-picker.validation';

const loginFields = defineFields([
  { source: BaseUserDto, name: 'email', isRequired: true },
  { source: BaseUserDto, name: 'password', isRequired: true },
] as const);

export class SystemLoginDto extends PickFromDtos(loginFields) {}

export class LoginWithGoogleDto {
  @IsString()
  @MinLength(100, { message: 'Invalid Token Id' })
  id_token: string;
}
