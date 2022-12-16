import { UpdateMealDto } from './dto/update-meal.dto';
import { CreateMealDto } from './dto/create-meal.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { MealService } from './meal.service';
import { Request } from 'express';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Meal } from './schema/meal.schema';
import { Public } from 'src/auth/public.decorator';

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
  @Public()
  @Get()
  async findAll(): Promise<Meal[]> {
    return this.mealService.findAll()
  }

  @ApiOperation({ summary: 'Get Top 5 Cheapeast Meals' })
  @Public()
  @Get('cheap')
  async findTopCheapMeal(): Promise<Meal[]> {
    return this.mealService.findCheapMeal()
  }

  @ApiOperation({ summary: 'Find Meals By ID' })
  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.mealService.findByID(id)
  }

  @ApiOperation({ summary: 'Find Restaurant By Its ID' })
  @Public()
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
  @Patch('update-meal/:id')
  async update(@Param('id') id: string, @Body() input: UpdateMealDto, @Req() request: Request) {
    const { userId } = request.user as { userId: string }
    return this.mealService.updateMeal(id, input, userId)
  }

  @ApiOkResponse({
    description: 'Meal Deleted Successful',
  })
  @ApiOperation({ summary: 'Delete Meal' })
  @ApiBearerAuth()
  @Delete(':id')
  async deleteMeal(@Param('id') id: string, @Req() request: Request) {
    const { userId } = request.user as { userId: string }
    return this.mealService.deleteMeal(id, userId)
  }
}
