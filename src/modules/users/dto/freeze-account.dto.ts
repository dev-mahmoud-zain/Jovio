import { PickType } from "@nestjs/mapped-types";
import { GeneralFields } from "src/common";

export class FreezeAccountDto extends PickType(GeneralFields, [
  'password',
]) {}


export class RestoreAccountDto extends PickType(GeneralFields, [
  "email",
  'password',
]) {}
