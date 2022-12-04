import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/user/schema/user.schema";
import { Location } from "./location.schema";

export type RestaurantDocument = Restaurant & mongoose.Document

export enum Category {
    FAST_FOOD = 'Fast Food',
    CAFETERIA = 'Cafe',
    FINE_DINNING = 'Fine Dinning',
    COFFEE_HOUSE = 'Coffee House',
    PIZZA_DELIVERY = 'Pizza Delivery'
}

@Schema({ timestamps: true })
export class Restaurant {

    @Prop({ type: String, required: true })
    name: string

    @Prop({ type: String, required: true })
    description: string

    @Prop({ type: String, required: true, trim: true, unique: true })
    email: string

    @Prop({ type: String, required: true, trim: true })
    phoneNo: string

    @Prop({ type: String, required: true })
    address: string

    @Prop({ type: [String], required: true })
    images: string[]

    @Prop({ type: Array })
    imagesId: Array<any>

    @Prop({ enum: Category })
    category: Category

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User

    @Prop({ type: Object, ref: 'Location'})
    location?: Location
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant)