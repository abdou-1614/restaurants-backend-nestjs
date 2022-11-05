import { v2 } from 'cloudinary';
import { Injectable } from "@nestjs/common";
import { UploadApiResponse, UploadApiErrorResponse} from 'cloudinary'
import toStream = require('buffer-to-stream');
@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File, id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload(file.filename, {public_id: id, folder: 'tmp', format: 'webp' },
            (error, result) => {
                if(error) return reject(error)
                return resolve(result)
            })
            toStream(file.buffer).pipe(upload)
        })
    }

    async destroyFile(publicId: string) {
        v2.uploader.destroy(publicId, (error, result) =>result)
    }
    
}