import { PickType } from '@nestjs/mapped-types';

import { GeneralFields } from 'src/common/general-fields';

export class ConfirmEmailDto extends PickType(GeneralFields, ['email', 'OTP_Code']) {
}