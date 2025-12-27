import { IsEnum, IsOptional, } from 'class-validator';

export class LogoutDto {
    @IsOptional()
    @IsEnum(["current","all"])
    logoutFlag:string
}