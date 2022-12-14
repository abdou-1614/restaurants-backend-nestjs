import { UserDocument } from './../user/schema/user.schema';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument, ReviewModel } from './schema/review.schema';
import mongoose, { Model, isValidObjectId } from 'mongoose';
import { Restaurant, RestaurantDocument } from 'src/restaurant/schema/restaurant.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { FindReviewQueryDto } from './dto/find-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectModel(Review.name) private reviewModel: ReviewModel,
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>
    ) {}

    async createReview(input: CreateReviewDto, user: UserDocument['_id'], restaurantId: RestaurantDocument['_id']) {
        const checkReview = await this.reviewModel.find({user, restaurantId})

         // 1) Check if the user make a review before on that restaurant

         if(checkReview.length !== 0) {
            throw new BadRequestException('Only One Review')
         }

         const restaurant = await this.restaurantModel.findById({ _id: restaurantId })

         if(!restaurant) {
            throw new NotFoundException('Restaurant Not Found')
         }

         const review = await  this.reviewModel.create({
            ...input,
            restaurant: restaurant._id,
            user
         })
         await this.reviewModel.calcAvgRating(this.restaurantModel, review.restaurant)

         return review
    }

    async findReviewById(reviewId: string) {

        const isValidId = mongoose.isValidObjectId(reviewId)
        if(!isValidId) {
            throw new BadRequestException('Wrong mongoose ID Error. Please, enter the correct ID')
        }

        const review = await this.reviewModel.findById({ _id: reviewId })

        if(!review) {
            throw new NotFoundException('Review Not Found')
        }

        return review
    }

    async findAllReview(query: FindReviewQueryDto): Promise<Review[]> {
        const page = query.page || 1
        const limit = query.limit || 10
        const skip = limit * ( page - 1 )

        const review = await this.reviewModel.find().limit(limit).skip(skip)

        if(review.length === 0) {
            throw new NotFoundException('Review Not Found')
        }

        return review
    }

    async updateReview(input: UpdateReviewDto, user: UserDocument['_id'], reviewId: string) {
        const isValidId = mongoose.isValidObjectId(reviewId)
        if(!isValidId) {
            throw new BadRequestException('Wrong mongoose ID Error. Please, enter the correct ID')
        }
        const review = await this.reviewModel.findById({_id: reviewId})

        // 1) Check if review doesn't exist
        if(!reviewId) {
            throw new NotFoundException('Review Not Found')
        }

        // 2) Check if the one who want to update review is the review creator

        if(review.user.toString() !== user.toString()) {
            throw new BadRequestException('Not Review Creator')
        }
        // 3) Update review

        return this.reviewModel.findByIdAndUpdate(reviewId, input, {
            new: true,
            runValidators: true
        })
    }

    async deleteReview(reviewId: string, user: UserDocument['_id']) {
        const isValidId = mongoose.isValidObjectId(reviewId)
        if(!isValidId) {
            throw new BadRequestException('Wrong mongoose ID Error. Please, enter the correct ID')
        }

        const review = await this.reviewModel.findById({ _id: reviewId })

        if(!review) {
            throw new NotFoundException('Review Not Found')
        }

        if(review.user.toString() !== user.toString()) {
            throw new BadRequestException('Not Review Creator')
        }

        await this.reviewModel.findByIdAndDelete(reviewId)

        return "Successful Review Delete"
    }
}
