import { Request } from "express";
import { User } from "src/Database/Models/user.model";
import { I_Decoded } from "../Utils/Security/token.service";
import { I_User } from "./user.interface";

export interface I_Request extends Request {
    credentials: {
        user?: I_User,
        decoded?: I_Decoded
    }
}