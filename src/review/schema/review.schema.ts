import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Restaurant, RestaurantDocument } from "src/restaurant/schema/restaurant.schema";
import { User } from "src/user/schema/user.schema";

export type ReviewDocument = Review & mongoose.Document

@Schema({ 
    timestamps: true,
    statics: {
        async calcAvgRating(this: ReviewModel , model: RestaurantModel, id: RestaurantDocument['_id']) {
            const stats = await this.aggregate([
                {
                    $match: { restaurant: id }
                },
                {
                    $group: {
                        _id: '$restaurant',
                        nRating: { $sum: 1 },
                        avgRating: { $avg: '$rating' }
                    }
                }
            ])
        
            if( stats.length > 0 ){
                await model.findByIdAndUpdate(id, {
                    ratingQuantity: stats[0].nRating,
                    ratingAverage: stats[0].avgRating
                })
            }else{
                await model.findByIdAndUpdate(id, {
                    ratingQuantity: 0,
                    ratingAverage: 4.5
                })
            }
        }
    }
 })
export class Review {

    @Prop({ type: String, required: true })
    review: string

    @Prop({ type: Number, reuired: true, min: 1, max: 5 })
    rating: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurnt', required: true })
    restaurant: Restaurant

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: User
}

export const ReviewSchema = SchemaFactory.createForClass(Review)

export interface RestaurantModel extends Model<RestaurantDocument | Restaurant> {}
export interface ReviewModel extends Model<ReviewDocument | Review> {
    calcAvgRating:(
        model: RestaurantModel,
        id: RestaurantDocument['_id']
    ) => Promise<ReviewDocument | undefined>
}

