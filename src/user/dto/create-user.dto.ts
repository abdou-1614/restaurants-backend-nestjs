import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, IsEmail, MinLength } from "class-validator"
import { ApiFile } from "src/common/decorators/file-upload-swagger.decorator"

export class CreateUserDto {
    @ApiProperty({
        format: 'string',
        description: 'FullName Of The User'
    })
    @IsNotEmpty()
    @IsString()
    fullName: string

    @ApiProperty({
        format: 'string',
        uniqueItems: true,
        description: 'E-mail Of The User'
    })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email:string

    @IsNotEmpty()
    @ApiFile()
    avatar: Express.Multer.File

    @ApiProperty({
        description: 'Password Of The User',
        format: 'string',
        minLength: 6
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @ApiProperty({
        description: 'Address Of The User',
        format: 'string'
    })
    @IsString()
    address: string
}