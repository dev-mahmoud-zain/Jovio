import { Length, IsString } from "class-validator";

export class BaseAuthDto {
    @Length(6)
    @IsString()
    otpCode: string;
}