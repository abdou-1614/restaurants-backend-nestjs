import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { Public } from 'src/auth/public.decorator';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


  @ApiOperation({ summary: 'Create Review For Restaurant' })
  @ApiBearerAuth()
  @Post('create-review/:id')
  async create(@Param('id') restaurantId: string, @Body() input: CreateReviewDto, @Req() request: Request) {
    const { userId } = request.user as { userId: string }
    return this.reviewService.createReview(input, userId, restaurantId)
  }

  @ApiOperation({ summary: 'Find Review By It"s ID' })
  @Public()
  @Get('/:reviewId')
  async findById(@Param('reviewId') reviewId: string) {
    return this.reviewService.findReviewById(reviewId)
  }
}
