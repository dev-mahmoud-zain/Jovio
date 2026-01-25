import { PickType } from '@nestjs/mapped-types';
import { Equals, IsOptional, IsString } from 'class-validator';
import { IsMatch } from 'src/Common/Validation/custom.validator';
import { GeneralFieldsDto } from 'src/Common/Validation/general.fields.dto';

export class SignupDto extends PickType(GeneralFieldsDto, ['fullName', 'email', 'phoneNumber', 'password', 'gender', 'dateOfBirth','userStatus']) {

    @IsMatch('password')
    @IsString()
    confirmPassword: string;


    @IsOptional()
    phoneNumber: string
}