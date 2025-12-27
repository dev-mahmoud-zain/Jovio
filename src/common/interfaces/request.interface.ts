import type { Request } from "express"
import { JwtPayload } from "jsonwebtoken"
import { UserDocument } from "src/DATABASE"

export interface IRequest extends Request {
    credentials?: {
        user: Partial<UserDocument>,
        decoded: JwtPayload
    }
}