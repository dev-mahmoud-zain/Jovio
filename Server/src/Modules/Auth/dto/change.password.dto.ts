import { IsString, Matches } from "class-validator";
import { IsMatch } from "src/Common/Validation/custom.validator";
import { GeneralRegex, GeneralRegexMessage } from "src/Common/Validation/user.regex";


export class ChangePasswordDto {

    @IsString()
    currentPassword: string;

    @Matches(
        GeneralRegex.PASSWORD,
        {
            message: GeneralRegexMessage.PASSWORD
        },
    )
    newPassword: string


    @IsMatch("newPassword")
    confirmNewPassword:string
}