import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DeleteCurrentUserDto {

    @ApiProperty({
        example: "password123"
    })
    @IsString()
    @IsNotEmpty()
    currentPassword: string
}