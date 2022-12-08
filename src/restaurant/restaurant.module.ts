import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from './schema/restaurant.schema';
import { MulterModule } from '@nestjs/platform-express';
import { multerUploadConfig } from 'src/utils/multer.utils';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Restaurant', schema: RestaurantSchema }]),
    MulterModule.register(multerUploadConfig),
    CloudinaryModule,
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService]
})
export class RestaurantModule {}
