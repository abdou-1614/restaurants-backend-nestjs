import { FilterQueryDto } from './dto/find-users.dto';
import { VerifyEmailDto } from './dto/verifiy-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Param, Req } from '@nestjs/common/decorators';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Registration User'})
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('avatar'), FileUploadBodyInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @ApiOperation({ summary: 'Confirmation User Email'})
  @Get('verification')
  async verifiyUserEmail(@Query() {verification}: VerifyEmailDto, id: string) {
    return this.userService.verifyUser({verification}, id)
  }

  @Get('/find/:id')
  async findId(@Param('id') id: string) {
    // const userId = request.user['userId']
    return this.userService.findUserById(id)
  }

  @Get()
  async findAllUsers(@Query() query: FilterQueryDto) {
      // let options = {}
      // if(query.search) {
      //   options = {
      //     $or: [
      //       { name: new RegExp(query.search.toString(), 'i') },
      //       { email: new RegExp(query.search.toString(), 'i') }
      //     ]
      //   }
      // }

      return this.userService.findAll(query)
      // return result
  }
}
