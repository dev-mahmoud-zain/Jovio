import { Types } from "mongoose";
import { I_File } from "./file.interface";

export interface I_UserGallery{
    profilePictures?: I_File[];
    coverPictures?: I_File[];
    galleryImages?: I_File[];
}


export interface I_CompanyGallery{
    logos ?: I_File[];
    coverPictures?: I_File[];
    galleryImages?: {
        postId:Types.ObjectId,
        images: I_File[]
    }[];
}