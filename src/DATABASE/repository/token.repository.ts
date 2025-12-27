import { InjectModel } from "@nestjs/mongoose";
import { DatabaseRepository } from "./database.repository";
import { Model } from "mongoose";
import {  Token, TokenDocument } from "../models";

export class TokenRepository extends DatabaseRepository<Token> {

    constructor(
        @InjectModel(Token.name)
        protected override readonly model: Model<TokenDocument>
    ) {
        super(model)
    }

}