import { RefreshTokenDocument } from './schema/token.schema';
import { UserDocument } from './../user/schema/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForgotPasswordDocument } from './schema/forgotPassword.schema';

@Injectable()
export class AuthService {
    constructor( 
        @InjectModel('User') private userModel: Model<UserDocument>,
        @InjectModel('Token') private refreshTokenModel: Model<RefreshTokenDocument>,
        @InjectModel('Auth') private forgotPasswordModel: Model<ForgotPasswordDocument>
        ) {}
}
