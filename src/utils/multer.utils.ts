import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

/** Constant containing a Regular Expression
 * with the valid image upload types
 */
 export const validImageUploadTypes = /jpeg|jpg|png/;

 /** Constant that sets the maximum image upload file size */
 export const maxImageUploadSize = 3 * 1024 * 1024; // 3MB
 
 /** Configurations for the multer library used for file upload.
  *
  * Accepts types jpeg, jpg and png of size up to 3MB
  */
 export const multerUploadConfig: MulterOptions = {
   storage: memoryStorage(),
 
   fileFilter: (_, file, callback) => {
     const mimetype = validImageUploadTypes.test(file.mimetype);
     const existtname = validImageUploadTypes.test(
       extname(file.originalname).toLowerCase(),
     );
 
     if (mimetype && existtname) {
       return callback(null, true);
     }
 
     return callback(new Error(`File Upload Support Only ${validImageUploadTypes}`), false);
   },
 
   limits: {
     fileSize: maxImageUploadSize,
   },
 };
