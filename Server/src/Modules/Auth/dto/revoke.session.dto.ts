import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class RevokeSessionDto{
    @IsMongoId({message:"Session Id Must Be ObjectId Type"})
    _id:Types.ObjectId;
}