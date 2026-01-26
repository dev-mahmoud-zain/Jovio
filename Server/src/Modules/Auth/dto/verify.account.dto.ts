import { PickType } from '@nestjs/mapped-types';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';

export class VerifyAccountDto extends PickType(GeneralFieldsDto, [
    'email',
    'otpCode'
    ]) {
}