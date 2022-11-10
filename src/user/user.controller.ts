import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('avatar'), FileUploadBodyInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }
}
