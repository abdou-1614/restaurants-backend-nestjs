import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { RestaurantSchema } from 'src/restaurant/schema/restaurant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MealSchema } from './schema/meal.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Restaurant', schema: RestaurantSchema }, { name: 'Meal', schema: MealSchema }]),
  ],
  controllers: [MealController],
  providers: [MealService]
})
export class MealModule {}
