import { AuthLoginDto } from './auth-login.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyForgotPasswordDto extends PickType(AuthLoginDto, ['email'] as const) {

    @ApiProperty({
        example: '123456',
        type: Number,
        format: 'number'
    })
    @IsNotEmpty()
    @IsNumber()
    token: number
}