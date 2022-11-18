import { User } from './../../user/schema/user.schema';
import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type RefreshTokenDocument = RefreshToken & Document 

@Schema({ timestamps: true })
export class RefreshToken {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    })
    user: User

    @Prop({ type: String, required: true, unique: true })
    family: string

    @Prop({ type: String })
    refreshToken: string

    @Prop({ type: String })
    ip?: string

    @Prop({ type: String })
    browserInfo?: string

    @Prop({ type: Date })
    expiresAt: Date
}

export const RedreshTokenSchema = SchemaFactory.createForClass(RefreshToken)