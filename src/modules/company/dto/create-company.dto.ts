import { Optional } from '@nestjs/common';
import {
  IsEmail,
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EmployeesRange } from 'src/common/enums/company.enum';

export class CreateCompanyDto {

  @MaxLength(300)
  @MinLength(3)
  @IsString()
  companyName: string;

  @IsEmail()
  companyEmail: string;

  @Optional()
  @MaxLength(5000)
  @MinLength(5)
  @IsString()
  description: string;

  @MaxLength(100)
  @MinLength(2)
  @IsString()
  industry: string;

  @IsString()
  @MinLength(5)
  @MaxLength(300)
  address: string;

  @IsEnum(EmployeesRange)
  employsRange: EmployeesRange;

  @Matches(/^\+20(10|11|12|15)\d{8}$/, {
    message:
      'Please enter a valid Egyptian phone number starting with +20 followed by a valid network code (010, 011, 012, or 015) — e.g., +201120809106.',
  })
  @IsString()
  phone: string;

}