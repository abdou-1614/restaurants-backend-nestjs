import { UpdateImagesDto } from './dto/update-restaurant-images.dto';
import { Public } from './../auth/public.decorator';
import { UpdateRestaurantDetailsDto } from './dto/update-restaurant.dto';
import { MultiFilesBodyInterceptor } from './../common/interceptors/multi-file.interceptor';
import { Body, Controller, Get, Param, Post, Put, Query, Req, UseInterceptors, Patch, Delete } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiOkResponse, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { FindRestaurantQueryDto } from './dto/find-restaurant.dto';
import { Restaurant } from './schema/restaurant.schema';

@ApiTags('Restaurant')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiBody({ type: CreateRestaurantDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create Restaurant' })
  @ApiBearerAuth()
  @Post('create-restaurant')
  @UseInterceptors(FilesInterceptor('images'), MultiFilesBodyInterceptor)
  async create(@Body() createInput: CreateRestaurantDto, @Req() request: Request) {
    const userId = request.user['userId'] 
    return this.restaurantService.createRestaurant(createInput, userId)
  }

  @ApiOperation({ summary: 'Find Restaurant' })
  @ApiBearerAuth()
  @Get('get-restaurant')
  async find(@Query() query: FindRestaurantQueryDto): Promise<Restaurant[]> {
    return this.restaurantService.findAll(query)
  }

  @ApiOperation({ summary: 'Find Restaurant By ID' })
  @ApiBearerAuth()
  @Get('restaurant/:id')
  async findByID(@Param('id') id: string ): Promise<Restaurant> {
    return this.restaurantService.findById(id)
  }

  @ApiOperation({ summary: 'Update Restaurant Details' })
  @ApiBearerAuth()
  @Patch('update-restaurant/:id')
  async update(@Param('id') id: string, @Body() input: UpdateRestaurantDetailsDto) {
    return this.restaurantService.updateDetails(id, input)
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateImagesDto })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update Restaurant Images' })
  @UseInterceptors(FilesInterceptor('images'), MultiFilesBodyInterceptor)
  @Patch('update-images-restaurant/:id')
  async updateImage(@Param('id') id: string, @Body() input: UpdateImagesDto) {
    return this.restaurantService.updateRestaurantImage(id, input)
  }

  @ApiResponse({
    status: 200,
    description: 'Successful Restaurant Delete'
  })
  @ApiOperation({ summary: 'Delete Restaurant' })
  @ApiBearerAuth()
  @Delete('delete-restaurant')
  async delete(@Param('id') id: string): Promise<string> {
    return this.restaurantService.delete(id)
  }

  @ApiOperation({ summary: 'Get Top 5 Rated Restaurant' })
  @ApiBearerAuth()
  @Get('top-5-resraurant')
  async findTop() {
      return this.restaurantService.findTopRatingRestaurant()
  }
}
