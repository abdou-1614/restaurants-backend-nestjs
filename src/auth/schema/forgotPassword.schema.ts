import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/user/schema/user.schema";

export type ForgotPasswordDocument = ForgotPassword & Document

@Schema({ timestamps: true })
export class ForgotPassword {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    user: User

    @Prop({ type: Number, required: true })
    forgotPasswordToken: number

    @Prop({ type: Date, required: true })
    forgotPasswordExpires: Date

    @Prop({ type: String })
    ip: string

    @Prop({ type: String })
    agent: string

    @Prop({ type: Boolean, default: false })
    used: boolean
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword)