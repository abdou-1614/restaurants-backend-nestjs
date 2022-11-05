import { CloudinaryProvider } from './cloudinary.provider';
import { Module } from "@nestjs/common";
import { CloudinaryService } from './cloudinary.service';

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryService, CloudinaryProvider]
})
export class CloudinaryModule {}