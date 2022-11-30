import { AuthLoginDto } from './dto/auth-login.dto';
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Req() request: Request, @Body() { email, password }: AuthLoginDto): Promise<AuthLoginResponse> {
      const browserInfo = `${request.ip} ${request.headers['user-agent']} ${request.headers['accept-language']}`.replace(/ undefined/g, '')

      return this.authService.signIn(email, password, browserInfo)
  }
}
