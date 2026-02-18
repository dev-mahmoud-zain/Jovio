import {
  ExtractProperties,
  PickFromDtos,
  configField,
} from 'src/Common/Validation/generic-picker.validation';
import { BaseUserDto } from './base-user.dto';
import { BaseUserSettingsDto } from './base-user-settings.dto';

const fields = [
  configField({ source: BaseUserDto, name: 'password', isRequired: true }),
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
] as const;

export class UpdateAccountDto extends (PickFromDtos([...fields])) {}
export interface UpdateAccountDto extends ExtractProperties<typeof fields> {}
