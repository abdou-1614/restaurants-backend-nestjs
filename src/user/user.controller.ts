import { FilterQueryDto } from './dto/find-users.dto';
import { VerifyEmailDto } from './dto/verifiy-email.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Body, Controller, Get, Post, Query, UseInterceptors, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadBodyInterceptor } from 'src/common/interceptors/fileUpload.interceptor';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Delete, Param, Req } from '@nestjs/common/decorators';
import { UserWithoutPassword } from './dto/user-without-password.dto';
import { UpdateUserInfo } from './dto/update-user.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserImage } from './dto/update-user-image.dto';
import { DeleteCurrentUserDto } from './dto/delete-user.dto';
import { Public } from 'src/auth/public.decorator';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { Request } from 'express';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: 'Registration User'})
  @ApiConsumes('multipart/form-data')
  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('avatar'), FileUploadBodyInterceptor)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto)
  }

  @ApiOperation({ summary: 'Confirmation User Email'})
  @Public()
  @Get('verification')
  async verifiyUserEmail(@Query() {verification}: VerifyEmailDto, id: string) {
    return this.userService.verifyUser({verification}, id)
  }

  @ApiOperation({ summary: 'Gets user"s own profile' })
  @ApiBearerAuth()
  @Get('/id')
  async findId(@Req() request: Request ) {
    const userId = request.user['userId']
    return this.userService.findUserById(userId)
  }

  @ApiOperation({ summary: 'Getting The Users With Searching And Pagination' })
  @IsAdmin()
  @Get()
  async findAllUsers(@Query() query: FilterQueryDto): Promise<UserWithoutPassword[]> {
    return this.userService.findAll(query)
  }

  @ApiOperation({ summary: 'Update User Profile' })
  @ApiBearerAuth()
  @Patch()
  async updateUserDetails(@Req() request: Request, @Body() updateInfo: UpdateUserInfo) {
    const userId = request.user['userId']
    return this.userService.update(userId, updateInfo)
  }

  @ApiBody({ type: UpdateUserImage })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update User Image' })
  @Patch('/images')
  @UseInterceptors(FileInterceptor('avatar'), FileUploadBodyInterceptor )
  async updateUserImage(@Req() request: Request, @Body() userImage: UpdateUserImage) {
    const userId = request.user['userId']
    return this.userService.updateUserImage(userId, userImage)
  }

  @ApiOperation({ summary: 'Delete User With It"s ID' })
  @IsAdmin()
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id)
  }

  @ApiOperation({ summary: 'User Can Delete Own Profile' })
  @ApiBearerAuth()
  @Delete('/me')
  async deleteMe(@CurrentUser() userId: UserDocument['_id'], @Body() currentUserPassword: DeleteCurrentUserDto) {
    return this.userService.delete(userId, currentUserPassword)
  }
}
