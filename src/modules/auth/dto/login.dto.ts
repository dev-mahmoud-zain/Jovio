import { PickType } from '@nestjs/mapped-types';

import { GeneralFields } from 'src/common/general-fields';

export class LoginDto extends PickType(GeneralFields, ['email', 'password']) {
}