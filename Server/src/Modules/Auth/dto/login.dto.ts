import { PickType } from '@nestjs/mapped-types';
import { IsString, Matches, MinLength } from 'class-validator';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';

export class SystemLoginDto extends PickType(GeneralFieldsDto, [
    'email',
    'password'
]) {
}

export class LoginWithGoogleDto {
    @MinLength(100,{message:"Invalid Token Id"})
    @IsString()
    id_token: string
}