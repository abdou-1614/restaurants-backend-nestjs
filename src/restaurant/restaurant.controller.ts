import { MultiFilesBodyInterceptor } from './../common/interceptors/multi-file.interceptor';
import { Body, Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RestaurantService } from './restaurant.service';
import { Public } from 'src/auth/public.decorator';

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
}
