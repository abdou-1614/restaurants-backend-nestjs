import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Request } from 'express';
import { AuthLoginResponse } from './dto/auth-login-response.dto';
import { LogoutDto } from './dto/logout.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UserDocument } from 'src/user/schema/user.schema';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User Log In' })
  @Public()
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() request: Request, @Body() { email, password }: AuthLoginDto): Promise<AuthLoginResponse> {
      const browserInfo = `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(/ undefined/g, '')

      return this.authService.signIn(email, password, browserInfo)
  }

  @ApiOkResponse({ type: AuthLoginResponse })
  @ApiOperation({ summary: 'RefereshToken' })
  @Public()
  @Post('/refresToken')
  async refreshToken(@Req() request: Request, @Body() { refreshToken }: RefreshTokenDto): Promise<AuthLoginResponse> {
    const browserInfo = `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(/ undefined/g, '')

    return this.authService.refreshToken(refreshToken, browserInfo)
  }

  @ApiOperation({ summary: 'Log Out User' })
  @ApiBearerAuth()
  @Post('/logout')
  async logout(@Body() { refreshToken }: LogoutDto) {
    return this.authService.logout(refreshToken)
  }

  @ApiOperation({ summary: 'Logs out user of all sessions' })
  @ApiBearerAuth()
  @Post('/logoutAll')
  async logouAll(@CurrentUser() userId: UserDocument['_id']) {
    return this.authService.logoutAll(userId)
  }

  @ApiOperation({ summary: 'Returns all user active tokens' })
  @ApiBearerAuth()
  @Get('/tokens')
  async findAllTokens(@CurrentUser() userId: UserDocument['_id']){
    return this.authService.findAllTokens(userId)
  }
}
