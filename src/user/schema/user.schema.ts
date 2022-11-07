import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { compare, genSalt, hashSync } from "bcrypt";
import mongoose from "mongoose";

export type UserDocument = User & mongoose.Document

export enum Role {
    ADMIN = 'Admin',
    USER = 'User'
}

@Schema({ timestamps: true })
export class User {

    @Prop({ type: String, minlength: 6, required: [true, 'FullName Is Required']})
    fullName: string

    @Prop({ type: String, trim: true, lowercase: true, required: [true, 'Email Is Required']})
    email: string

    @Prop({ type: String})
    avatar: string

    @Prop({ type: String})
    avatarId: string

    @Prop({ type: String})
    address: string

    @Prop({ type: String, minlength: 6, required: [true, 'Password Is Required']})
    password: string

    @Prop({ type: String, enum: Role, default: Role.USER})
    role: Role

    @Prop({ type: Boolean, default: true})
    isActive: boolean

    @Prop({ type: Boolean, default: false})
    verified: boolean

    @Prop({ type: String, })
    verification: string

    @Prop({ type: Date, default: Date.now()})
    verificationExpires: Date

    @Prop({ type: Number, default: 0})
    confirmationAttemptsCount: number

    @Prop({ type: Date})
    blockExpires: Date
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function() {
    const user = this as UserDocument
    if(!user.isModified('password')) {
        return
    }

    const salt = await genSalt(10)
    const hashed = await hashSync(user.password, salt)

    user.password = hashed
})

UserSchema.methods.comparPassword = async function(condidatePassword: string) {
    try{
        const user = this as UserDocument
        return compare(condidatePassword, user.password)
    }catch(e) {
        console.error(e, 'Password Can Not Validate')
        return false
    }
}