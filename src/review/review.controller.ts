import { CreateReviewDto } from './dto/create-review.dto';
import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


  @Post('create-review/:id')
  async create(@Param('id') restaurantId: string, @Body() input: CreateReviewDto, @Req() request: Request) {
    const { userId } = request.user as { userId: string }
    return this.reviewService.createReview(input, userId, restaurantId)
  }
}
