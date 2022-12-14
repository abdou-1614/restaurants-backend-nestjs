import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant } from 'src/restaurant/schema/restaurant.schema';
import { Meal } from './schema/meal.schema';

@Injectable()
export class MealService {
    constructor(
        @InjectModel(Restaurant.name) private restaurantModel: Model<Restaurant>,
        @InjectModel(Meal.name) private mealModel: Model<Meal>
        ) {}
}
