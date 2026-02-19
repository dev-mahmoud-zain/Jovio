import {
  defineFields,
  PickFromDtos,
} from 'src/Common/Validation/generic-picker.validation';
import { BaseUserDto } from './base-user.dto';
import { BaseUserSettingsDto } from './base-user-settings.dto';

const fields = defineFields([
  { source: BaseUserDto, name: 'password', isRequired: true },
  { source: BaseUserDto, name: 'dateOfBirth', isRequired: false },
  { source: BaseUserDto, name: 'bio', isRequired: false },
  { source: BaseUserDto, name: 'skills', isRequired: false },
  { source: BaseUserDto, name: 'socialLinks', isRequired: false },
  { source: BaseUserDto, name: 'resume', isRequired: false },
  { source: BaseUserDto, name: 'coverPicture', isRequired: false },
  {
    source: BaseUserDto,
    name: 'profilePicture',
    isRequired: false,
  },
  {
    source: BaseUserSettingsDto,
    name: 'profileVisibility',
    isRequired: false,
  },
] as const);

export class UpdateAccountDto extends PickFromDtos(fields) {}
