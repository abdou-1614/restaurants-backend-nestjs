import { UserDocument } from './../user/schema/user.schema';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewModel } from './schema/review.schema';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from 'src/restaurant/schema/restaurant.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: ReviewModel,
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>
    ) {}

    async createReview(input: CreateReviewDto, user: UserDocument['_id'], restaurantId: RestaurantDocument['_id']) {
        const checkReview = await this.reviewModel.find({user, restaurantId})

         // 1) Check if the user make a review before on that product

         if(checkReview.length !== 0) {
            throw new BadRequestException('Only One Review')
         }

         await this.reviewModel.calcAvgRating(restaurantId, this.restaurantModel)

         return this.reviewModel.create({
            ...input,
            restaurant: restaurantId,
            user
         })
    }
}
