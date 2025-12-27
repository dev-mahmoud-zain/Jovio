import { UploadApiResponse } from 'cloudinary';
import cloudinary from './cloudinary.config';
import { deleteFolderFromCloudinary } from './cloudinary.delete';
import { IImage } from 'src/common/interfaces/image.interface';

export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder: string = "E_Commerce"
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed'));
        resolve(result);
      },
    );
    upload.end(file.buffer);
  });
}

export async function uploadMultiImagesToCloudinary(
  files: Express.Multer.File[],
  path: string
): Promise<IImage[] | false> {

  const images: IImage[] = [];

  await Promise.all(
    files.map(async (file) => {
      const result = await uploadToCloudinary(file, path);


      if (!result) {
        deleteFolderFromCloudinary(path);
        return false;
      }


      images.push({
        public_id: result.public_id,
        url: result.url
      });


    })
  );


  if (!images) {
    return false
  }

  return images;

}