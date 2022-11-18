import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class AuthLoginDto {

    @ApiProperty({
        example: 'user@example.com',
        uniqueItems: true,
        format: 'email'
    })
    @IsNotEmpty()
    @IsEmail()
    email: string

    @ApiProperty({
        example: 'password@123',
        required: true,
        type: String
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password: string
}