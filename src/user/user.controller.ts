import { VerifyEmailDto } from './dto/verifiy-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';

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
}
