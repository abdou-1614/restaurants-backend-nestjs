import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ReviewSchema } from './schema/review.schema';
import { RestaurantSchema } from 'src/restaurant/schema/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Review', schema: ReviewSchema}, { name: 'Restaurant', schema: RestaurantSchema }])
  ],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
