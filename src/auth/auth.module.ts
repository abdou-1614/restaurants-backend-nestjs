import { MailModule } from './../mail/mail.module';
import { RefreshTokenSchema } from './schema/token.schema';
import { ForgotPasswordSchema } from './schema/forgotPassword.schema';
import { UserSchema } from './../user/schema/user.schema';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenJwtStrategy } from './auth-access-jwt.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([ 
    { name: 'Auth', schema: ForgotPasswordSchema }, 
    { name: 'Token', schema: RefreshTokenSchema }, 
    { name: 'User', schema: UserSchema } ]), 
    PassportModule, JwtModule.register({}), MailModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenJwtStrategy]
})
export class AuthModule {}
