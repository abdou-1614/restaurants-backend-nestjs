import { CreateMealDto } from './dto/create-meal.dto';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { MealService } from './meal.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Meal } from './schema/meal.schema';

@ApiTags('Meal')
@Controller('meal')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @ApiCreatedResponse({
    description: 'Meal Created SuccessFul',
    type: CreateMealDto
  })
  @ApiOperation({ summary: 'Create Meal' })
  @ApiBearerAuth()
  @Post('create-meal')
  async createMeal(@Body() input: CreateMealDto, @Req() request: Request) {
    const { userId } = request.user as { userId: string };
    return this.mealService.create(input, userId)
  }

  @ApiOkResponse({
    description: 'Meal Resturned Successful',
    type: CreateMealDto
  })
  @ApiOperation({ summary: 'Find All Meals' })
  @Get()
  async findAll(): Promise<Meal[]> {
    return this.mealService.findAll()
  }
}
