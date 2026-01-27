import { PickType } from '@nestjs/mapped-types';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';

export class SystemLoginDto extends PickType(GeneralFieldsDto, [
    'email',
    'password'
]) {
}

