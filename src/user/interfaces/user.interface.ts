import { ApiProperty } from "@nestjs/swagger";
import { Document } from "mongoose";
import { Role } from "../schema/user.schema";

export class UserInteface extends Document {
    @ApiProperty()
    fullName: string

    @ApiProperty()
    email: string

    @ApiProperty()
    address: string

    @ApiProperty()
    password: string

    @ApiProperty()
    avatar: string

    @ApiProperty()
    avatarId: string

    @ApiProperty()
    role: Role

    @ApiProperty()
    verified: boolean

    @ApiProperty()
    verification: string

    @ApiProperty()
    verificationExpires: Date

    @ApiProperty()
    isActive: boolean

    @ApiProperty()
    confirmationAttemptsCount: number

    @ApiProperty()
    blockExpires: Date
}