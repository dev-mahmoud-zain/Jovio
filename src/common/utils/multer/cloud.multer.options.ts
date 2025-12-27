import { BadRequestException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Request } from "express";
import { diskStorage, memoryStorage } from "multer";
import { IMulterFile } from "src/common/interfaces";

import { StorageEnum } from "src/common/enums";
import { tmpdir } from "os";

export const cloudFileUpload = (
    {
        storageApproach = StorageEnum.memory,
        validation = [],
        fileSize = 5 }
        : {
            storageApproach?: StorageEnum,
            validation: string[],
            fileSize?: number
        }) => {

            
    let basePath: string;

    return {
        storage: storageApproach == StorageEnum.memory ? memoryStorage() :
            diskStorage({
                destination: tmpdir(),
                filename: function name(req: Request, file: Express.Multer.File, callback) {
                    callback(null, `${randomUUID()}_${file.originalname}`)
                }
            })
        ,
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