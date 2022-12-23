import { CreateReviewDto } from './dto/create-review.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Request } from 'express';
import { Public } from 'src/auth/public.decorator';
import { FindReviewQueryDto } from './dto/find-review.dto';
import { Review } from './schema/review.schema';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}


  @ApiOkResponse({ 
    type: CreateReviewDto,
    description: 'Successful Create Review'
   })
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

  @ApiOkResponse({ 
    type: [CreateReviewDto],
    description: 'Successful Reviews Found'
   })
  @ApiOperation({ summary: 'Find All Review With Pagination' })
  @Public()
  @Get()
  async findAll(@Query() query: FindReviewQueryDto): Promise<Review[]> {
    return this.reviewService.findAllReview(query)
  }
}
