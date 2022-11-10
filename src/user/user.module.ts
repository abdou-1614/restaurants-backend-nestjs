import { CloudinaryModule } from './../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserSchema } from './schema/user.schema';
import { MailModule } from 'src/mail/mail.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerUploadConfig } from 'src/utils/multer.utils';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
    MulterModule.register(multerUploadConfig),
    MailModule,
    CloudinaryModule,
],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
