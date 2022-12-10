import { MultiFilesBodyInterceptor } from './../common/interceptors/multi-file.interceptor';
import { Body, Controller, Get, Param, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
