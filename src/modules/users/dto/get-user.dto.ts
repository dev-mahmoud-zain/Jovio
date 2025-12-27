import { PickType } from "@nestjs/mapped-types";
import { GeneralFields } from "src/common";

export class GetUserByIdParamDto extends PickType(GeneralFields, [
  '_id',
]) {}