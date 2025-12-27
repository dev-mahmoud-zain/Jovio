import { PickType } from '@nestjs/mapped-types';
import { GeneralFields } from 'src/common/general-fields';

export class ReSend_OTP_Dto extends PickType(GeneralFields, ['email']) {
}