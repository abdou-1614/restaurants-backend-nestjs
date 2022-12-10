import { MultiFilesBodyInterceptor } from './../common/interceptors/multi-file.interceptor';
import { Body, Controller, Get, Post, Query, Req, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { FindRestaurantQueryDto } from './dto/find-restaurant.dto';

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
  async find(@Query() query: FindRestaurantQueryDto) {
    return this.restaurantService.findAll(query)
  }
}
