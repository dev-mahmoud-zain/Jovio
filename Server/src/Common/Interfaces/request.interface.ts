import { Request } from "express";
import { User } from "src/Database/Models/user.model";
import { I_User } from "./user.interface";
import { I_Decoded } from "../Types/token.types";

export interface I_Request extends Request {
    credentials: {
        user?: I_User,
        decoded?: I_Decoded
    }
}