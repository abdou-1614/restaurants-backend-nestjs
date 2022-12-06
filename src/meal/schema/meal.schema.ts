import { User } from './../../user/schema/user.schema';
import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type MealDocyment = Meal & mongoose.Document

export enum Category {
    SOUPS = 'Soups',
    SALADS = 'Salads',
    SANDWICHES = 'Sandwiches',
    PASTA = 'Pasta',
  }

@Schema({ timestamps: true })
export class Meal {

    @Prop({ type: String, unique: true })
    name: string

    @Prop({ type: String })
    description: string

    @Prop({ type: Number })
    price: number

    @Prop({ enum: Category })
    category: Category

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
    restaurant: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

}

export const MealSchema = SchemaFactory.createForClass(Meal)