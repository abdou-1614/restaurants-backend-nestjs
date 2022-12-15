import { ForbiddenException, NotFoundException } from '@nestjs/common/exceptions';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Restaurant } from 'src/restaurant/schema/restaurant.schema';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { CreateMealDto } from './dto/create-meal.dto';
import { Meal } from './schema/meal.schema';

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
        @InjectModel(Meal.name) private mealModel: Model<Meal>
        ) {}

        async create(input: CreateMealDto, user: string) {
            const restaurant = await this.restaurantModel.findById(input.restaurant)

            if(!restaurant) throw new NotFoundException('Restaurant Not Found')

            if(restaurant.user.toString() !== user.toString()) {
                throw new ForbiddenException('You cannot add a meal to this restaurant');
            }
            const meal = await this.mealModel.create({
                ...input,
                user: user
            })

            restaurant.menu.push(meal)

            await restaurant.save()

            return meal
        }

        async findAll(): Promise<Meal[]> {
            return await this.mealModel.find()
        }

        async findAllRestaurant(restaurantId: string) {
            return this.mealModel.find({ restaurant: restaurantId })
        }

        async findByID(id: string) {
            const isValidID = mongoose.isValidObjectId(id)

            if(!isValidID) throw new BadRequestException('Wrong mongoose ID error')

            const mealFound = await this.mealModel.findById({ _id: id })

            if(!mealFound) throw new NotFoundException('Meal Not Found')      
            
            return mealFound
        }
}
