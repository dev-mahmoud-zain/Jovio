import { IsString } from "class-validator";

export class SignUpWithGmailDto {
    @IsString()
    id_token :string
}