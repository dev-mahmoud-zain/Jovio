import { Request } from "express";
import { User } from "src/Database/Models/user.model";
import { I_Decoded } from "../Utils/Security/token.service";

export interface I_Request extends Request {
    credentials: {
        user?: User,
        decoded?: I_Decoded
    }
}