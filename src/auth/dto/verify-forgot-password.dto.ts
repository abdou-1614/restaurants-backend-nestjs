import { AuthLoginDto } from './auth-login.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, MaxLength, MinLength } from 'class-validator';

export class VerifyForgotPasswordDto {

    @ApiProperty({
        type: String,
        example: 'user@gmail.com',
        description: 'the unique email for each user',
        uniqueItems: true,
        minLength: 5,
        maxLength: 256,
      })
    @IsOptional()
    @MinLength(5)
    @MaxLength(256)
    @IsEmail()
    readonly email?: string;

    @ApiProperty({
        example: '123456',
        type: Number,
        format: 'number'
    })
    @IsNotEmpty()
    @IsNumber()
    token: number
}