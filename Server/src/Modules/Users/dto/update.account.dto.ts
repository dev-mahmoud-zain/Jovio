import { BaseUserDto } from './base-user.dto';
import { BaseUserSettingsDto } from './base-user-settings.dto';
import {
  PickFromDtos,
  configField,
} from 'src/Common/Validation/generic-picker.validation';

const fields = [
  configField({ source: BaseUserDto, name: 'password', isRequired: false }),
  configField({ source: BaseUserDto, name: 'dateOfBirth', isRequired: false }),
  configField({ source: BaseUserDto, name: 'bio', isRequired: false }),
  configField({ source: BaseUserDto, name: 'skills', isRequired: false }),
  configField({ source: BaseUserDto, name: 'socialLinks', isRequired: false }),
  configField({ source: BaseUserDto, name: 'resume', isRequired: false }),
  configField({ source: BaseUserDto, name: 'coverPicture', isRequired: false }),
  configField({
    source: BaseUserDto,
    name: 'profilePicture',
    isRequired: false,
  }),
  configField({
    source: BaseUserSettingsDto,
    name: 'profileVisibility',
    isRequired: false,
  }),
];

export class UpdateAccountDto extends PickFromDtos(fields) {}
