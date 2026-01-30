import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';

export class SystemLoginDto extends PickType(GeneralFieldsDto, [
    'email',
    'password'
]) {
}


export class LoginWithGoogleDto {

    @IsString()
    token_id:string
}