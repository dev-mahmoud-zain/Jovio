import { PickType } from "@nestjs/mapped-types";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";
import { GeneralFieldsDto } from "src/Common/Validation/general.fields.dto";



export class RevokeSessionDto extends PickType(GeneralFieldsDto, [
    '_id',
]) {
}