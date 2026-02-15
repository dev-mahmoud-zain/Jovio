import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class RevokeSessionDto {
    @IsMongoId()
    _id: Types.ObjectId;
}
