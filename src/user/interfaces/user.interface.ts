import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { Role } from "../schema/user.schema";

export class UserInteface extends Document {
    @ApiProperty({
        example: 'James Doe'
    })
    fullName: string

    @ApiProperty({
        example: 'example@user.com'
    })
    email: string

    @ApiProperty({
        example: 'World Street 0'
    })
    address: string

    @ApiProperty({
        example: 'password123'
    })
    password: string

    @ApiProperty({
        example: 'https://res.cloudinary.com/dknma8cck/image/upload/v1629291909/EcommerceAPI/Users/admin/xxcrbfkwglqa5c5kay4u.webp'
    })
    avatar: string

    @ApiProperty({
        example: 'xxcrbfkwglqa5c5kay4u'
    })
    avatarId: string

    @ApiProperty({
        example: 'USER'
    })
    role: Role

    @ApiProperty({
        example: false
    })
    verified: boolean

    @ApiProperty()
    verification: string

    @ApiProperty()
    verificationExpires: Date

    @ApiProperty({
        example: true
    })
    isActive: boolean

    @ApiProperty()
    confirmationAttemptsCount: number

    @ApiProperty()
    blockExpires: Date
}