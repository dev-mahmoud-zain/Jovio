import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { resolve } from "path";
import { IMulterFile } from "src/common/interfaces";
import { IRequest } from "src/common/interfaces"; 
export const localFileUpload = (

    { folder = "public", validation = [], fileSize = 5 }
        : { folder: string, validation: string[], fileSize?: number }) => {
    let basePath: string;

    return {
        storage: diskStorage({
            destination(req: IRequest, file: IMulterFile, callback) {

                basePath = `uploads/user/${req.credentials?.user._id}/${folder}`;
                const fullPath = resolve(`./${basePath}`);

                if (!existsSync(fullPath)) {
                    mkdirSync(fullPath, { recursive: true });
                }

                callback(null, fullPath)
            },
            filename(req: Request, file: IMulterFile, callback) {
                const fileName = randomUUID() + "_" + Date.now() + "_" + file.originalname;
                file.finalPath = `${basePath}/${fileName}`;
                callback(null, fileName)
            },
        }),
        fileFilter(req: Request, file: IMulterFile, callback) {
            if (!validation.includes(file.mimetype)) {
                return callback(new BadRequestException("Invalid File Format"))
            }
            return callback(null, true)
        },
        limits: {
            fileSize: fileSize * 1024 * 1024
        }
    }
}