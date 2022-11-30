import { RefreshTokenDto } from './dto/refreshToken.dto';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';
import { Request } from 'express';
import { AuthLoginResponse } from './dto/auth-login-response.dto';

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
}
