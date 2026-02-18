import {
  IsEmail,
  IsMongoId,
  IsString,
  IsUrl,
  Matches,
  IsOptional,
  IsEnum,
  MaxLength,
  ValidateNested,
  IsLatitude,
  IsLongitude,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";
import { CompanyStatus, CompanyVerificationStatusEnum } from "src/Common/Interfaces/company.interface";
import { UserDefinitions } from "src/Modules/Users/Definitions/user.definitions";
import { UserErrors } from "src/Modules/Users/Errors/user.error";



/* ================= LOCATION DTO ================= */

export class LocationDto {

  @IsString()
  @MaxLength(100)
  country: string;

  @IsString()
  @MaxLength(100)
  city: string;

  @IsString()
  @MaxLength(200)
  street: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  building?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

/* ================= BASE COMPANY DTO ================= */

export class BaseCompanyDto {

  @IsMongoId()
  companyId: Types.ObjectId;

  @IsMongoId()
  owner: Types.ObjectId;

  @IsString()
  @MaxLength(100)
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @Matches(UserDefinitions.REGEX.PHONE_NUMBER, {
    message: UserErrors.PHONE_NUMBER
  })
  phone?: string;

  @IsOptional()
  @IsUrl(
    {
      require_protocol: true,
      require_tld: true,
      protocols: ["http", "https"]
    },
    {
      message: "Website must be a valid URL starting with http or https"
    }
  )
  website?: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsString()
  @MaxLength(100)
  industry: string;

  @Matches(/^\d{1,5}-\d{1,5}$/, {
    message: "Size must be in format like 11-50"
  })
  size: string;

  @Matches(/^\d{4}$/, {
    message: "Founded year must be in format YYYY"
  })
  foundedAt: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsEnum(CompanyVerificationStatusEnum)
  verificationStatus?: CompanyVerificationStatusEnum;

  @IsOptional()
  @IsEnum(CompanyStatus)
  status: CompanyStatus;
}
