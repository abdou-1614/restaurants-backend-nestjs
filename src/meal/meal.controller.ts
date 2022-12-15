import { UpdateMealDto } from './dto/update-meal.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { Body, Controller, Get, Param, Post, Put, Req } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Find Meals By ID' })
  @Get('id')
  async findById(@Param('id') id: string) {
    return this.mealService.findByID(id)
  }

  @ApiOperation({ summary: 'Find Restaurant By Its ID' })
  @Get('find-restaurant/:id')
  async findRestaurant(@Param('id') restaurantId: string) {
    return this.mealService.findAllRestaurant(restaurantId)
  }

  @ApiOkResponse({
    description: 'Meal Updated Successful',
    type: CreateMealDto
  })
  @ApiOperation({ summary: 'Update Meal' })
  @ApiBearerAuth()
  @Put('update-meal/:id')
  async update(@Param('id') id: string, @Body() input: UpdateMealDto, @Req() request: Request) {
    const { userId } = request.user as { userId: string }
    return this.mealService.updateMeal(id, input, userId)
  }

}
