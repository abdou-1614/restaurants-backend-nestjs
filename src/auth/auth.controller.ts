import { VerifyForgotPasswordDto } from './dto/verify-forgot-password.dto';
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
import { ChangeMyPasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

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
  @Post('/refreshToken')
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
  async logouAll(@Req() request: Request) {
    const { userId } = request.user as { userId: string };
    return this.authService.logoutAll(userId)
  }

  @ApiOperation({ summary: 'Returns all user active tokens' })
  @ApiBearerAuth()
  @Get('/tokens')
  async findAllTokens(@Req() request: Request){
    const { userId } = request.user as { userId: string };
    return this.authService.findAllTokens(userId)
  }

  @ApiOperation({ summary: 'User Change Current Password' })
  @ApiBearerAuth()
  @Post('/change-my-password')
  async changeMyPassword(@Req() request: Request, @Body() changePasswordDto: ChangeMyPasswordDto): Promise<AuthLoginResponse> {
    const { userId } = request.user as { userId: string };
    return this.authService.changeMyPassword(userId, changePasswordDto)
  }

  @ApiOperation({ summary: 'Forgot Password User' })
  @Public()
  @Post('/forgot-password')
  async forgetPassword(@Body() forgotPassword: ForgotPasswordDto): Promise<{ forgotPasswordToken: number }> {
    return this.authService.forgotPassword(forgotPassword)
  }

  @ApiOperation({ summary: 'Resend Forgot Password OTP' })
  @Public()
  @Post('/resend-forgot-password')
  async resendForgotPassword(@Body() ForgotPassword: ForgotPasswordDto) {
    return this.authService.resendForgetPassword(ForgotPassword)
  }

  @ApiOperation({ summary: 'Verify Forgot Password Code' })
  @Public()
  @Post('/verify-forgot-password')
  async verifyForgotPassword(@Body() verifyForgotPassword: VerifyForgotPasswordDto) {
    return this.authService.verifyForgetPassword(verifyForgotPassword)
  }

  @ApiOperation({ summary: 'Reset Password After Verify OTP' })
  @Public()
  @Post('/reset-forgot-password')
  async resetPassword(@Body() resetPasswordDto: PasswordResetDto): Promise<AuthLoginResponse> {
    return this.authService.resetPassword(resetPasswordDto)
  }
}
