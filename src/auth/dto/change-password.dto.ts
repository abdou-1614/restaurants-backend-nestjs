import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class ChangeMyPasswordDto {

    @ApiProperty({
        example: 'oldPassword',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    old_password: string

    @ApiProperty({
        example: 'oldPassword',
        format: 'string'
    })
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    new_password: string
}