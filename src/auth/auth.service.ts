import { PasswordResetDto } from './dto/password-reset.dto';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { ChangeMyPasswordDto } from './dto/change-password.dto';
import { InvalidRefreshTokenException } from './exceptions/invalid-refresh-token.exception';
import { RefreshTokenPayload } from './types/refresh-token-payload';
import { refreshTokenConfig } from 'src/config/jwt.config';
import { compare } from 'bcrypt';
import { InvalidEmailOrPasswordException } from './exceptions/invalid-email-or-password.exception';
import { RefreshTokenDocument } from './schema/token.schema';
import { privateField, UserDocument } from './../user/schema/user.schema';
import { Injectable, BadRequestException, UnauthorizedException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { ForgotPasswordDocument } from './schema/forgotPassword.schema';
import { omit } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { accessTokenConfig } from 'src/config/jwt.config';
import { getTokenExpirationDate } from 'src/utils/tokenExpirationDate.utils';
import { v4 as uuidv4 } from 'uuid'
import global from '../constants/global.constants'
import { addHours } from 'date-fns';
import { AuthLoginResponse } from './dto/auth-login-response.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { getClientIp } from 'request-ip';
import { MailService } from 'src/mail/mail.service';
import { VerifyForgotPasswordDto } from './dto/verify-forgot-password.dto';

@Injectable()
export class AuthService {

    HOURS_TO_BLOCK = 6
    LOGIN_ATTEMPTS_TO_BLOCK = 5
    HOURS_TO_EXPIRE = 1

    constructor( 
        @InjectModel('User') private userModel: Model<UserDocument>,
        @InjectModel('Token') private refreshTokenModel: Model<RefreshTokenDocument>,
        @InjectModel('Auth') private forgotPasswordModel: Model<ForgotPasswordDocument>,
        private readonly mailService: MailService,
        @Inject(REQUEST) private request: Request,
        private jwtService: JwtService
        ) {}

        async signIn(email: string, password: string, browserInfo?: string): Promise<AuthLoginResponse> {
            const user = await this.validateUser(email, password)
            const payload = { sub: user._id , userRole: user.role }

            const accessToken = await this.generatAccessToken(payload)

            const refreshToken = await this.createRefreshToken(
                { sub: payload.sub }, 
                browserInfo
                )

            return {
                accessToken,
                refreshToken
            }
        }

        async refreshToken(refreshToken: string, browserInfo?: string): Promise<AuthLoginResponse> {
            const refreshTokenContent: RefreshTokenPayload = await this.jwtService.verifyAsync(refreshToken, refreshTokenConfig)

            await this.validateRefreshToken(refreshToken, refreshTokenContent)

            const userRole = await this.getUserRole(refreshTokenContent.sub)

            const accessToken = await this.generatAccessToken({
                sub: refreshTokenContent.sub,
                userRole
            })

            const newRefreshToken = await this.rotateRefreshToken(
                refreshToken,
                refreshTokenContent,
                browserInfo
            )

            return {
                accessToken,
                refreshToken: newRefreshToken
            }

        }

        async logout(refreshToken: string) {
            return this.refreshTokenModel.findOneAndDelete({ refreshToken })
        }

        async logoutAll(userId: string) {
            return this.refreshTokenModel.deleteMany({userId})
        }

        async findAllTokens(userId: string) {
            const tokens = await this.refreshTokenModel.find({ userId })
            return tokens
        }

        async changeMyPassword(id: string, changeMyPasswordDto: ChangeMyPasswordDto, browserInfo?: string):Promise<AuthLoginResponse> {
            const { old_password, new_password } = changeMyPasswordDto

            const isValidId = isValidObjectId(id)

            if(!isValidId) {
                throw new BadRequestException('Wrong mongoose ID Error. Please, enter the correct ID')
            }

            const user = await this.userModel.findOne({ _id: isValidObjectId(id) }).select("password")

            const isCorrectPassword = await compare(old_password, user.password)
            if(!isCorrectPassword) {
                throw new BadRequestException('the entered password is invalid')
            }

            const payload = { sub: user._id, userRole: user.role }
            const accessToken = await this.generatAccessToken(payload)
            const refreshToken = await this.createRefreshToken({sub: payload.sub}, browserInfo)

            user.password = new_password
            await user.save()

            return {
                accessToken,
                refreshToken
            }

        }

        async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ forgotPasswordToken: number }> {
            const { email } = forgotPasswordDto
            const user = await this.userModel.findOne({ email, verified: true, isActive: true })

            if(!user) {
                throw new NotFoundException('User Not Found')
            }

            const otp = this.generateRandomOtp(6)

            await this.mailService.sendUserForgetPassword(user, otp)

            const forgotPassword = await this.createForgetPassword(user._id)

            return {
                forgotPasswordToken: forgotPassword
            }
        }

        async verifyForgetPassword(verifyForgotPasswordDto: VerifyForgotPasswordDto) {
            const { email, token } = verifyForgotPasswordDto

            const user = await this.userModel.findOne({ email, verified: true, isActive: true })
            if(!user) {
                throw new NotFoundException('User Not Found')
            }

            const forgotPassword = await this.forgotPasswordModel.findOne({ forgotPasswordToken: token })

            const { forgotPasswordExpires, forgotPasswordToken } = forgotPassword

            let user_id;

            if(forgotPasswordExpires < new Date()) {
                user_id = user._id
                await this.forgotPasswordModel.deleteMany({ user: user_id })
                throw new BadRequestException('Code Has Been Expired! Please Request Again')
            }

            if(forgotPasswordToken !== token) {
                throw new BadRequestException('Invalid Code Passed! Please Check Your Inbox')
            }

            forgotPassword.used = true
            forgotPassword.forgotPasswordToken = null

            await user.save()
            return 'Okay, Now Reset Your Password'
        }

        async resetPassword(resetPasswordDto: PasswordResetDto,): Promise<AuthLoginResponse> {
            const { email, password } = resetPasswordDto

            const user = await this.userModel.findOne({ email, verified: true, isActive: true })
            if(!user) {
                throw new NotFoundException('User Not Found')
            }
            
            const forgotPassword = await this.forgotPasswordModel.findOne({
                user: user._id,
                used: true
            })

            if(!forgotPassword) throw new BadRequestException('please verify again');

            user.password = password
            await user.save()

            const browserInfo = `${this.request.ip} ${this.request.headers['user-agent']} ${this.request.headers['accept-language']}`.replace(/ undefined/g, '')

            return {
                accessToken: await this.generatAccessToken({ sub: user._id, userRole: user.role }),
                refreshToken: await this.createRefreshToken({ sub: user._id }, browserInfo)
            }
        }

        async resendForgetPassword(forgotPasswordDto: ForgotPasswordDto) {
            const { email } = forgotPasswordDto

            const user = await this.userModel.findOne({email, verified: true, isActive: true})

            await this.forgotPasswordModel.deleteMany({ user: user._id })

            await this.forgotPassword({ email })

            return 'OK ! Resend Verification Code'
            
        }

         // ***************** PRIVATE METHODS ********************

        async createForgetPassword(user_id: UserDocument): Promise<number> {
            const forgotPassword = await this.forgotPasswordModel.create({
                user: user_id,
                forgotPasswordToken: this.generateRandomOtp(6),
                forgotPasswordExpires: addHours(Date.now(), this.HOURS_TO_EXPIRE),
                ip: getClientIp(this.request),
                agent: this.request.headers['user-agent'] || "XX",
                used: false
            })

            return forgotPassword.forgotPasswordToken
        }



        private async validateUser(email: string, password: string) {
            const user = await this.userModel.findOne({ email, verified: true, isActive: true })
            if(!user) {
                throw new InvalidEmailOrPasswordException()
            }

            this.isUserBlocked(user)

            await this.checkPasswordAttemps(user, password)

            return user
        }

        private async isUserExist(email: string) {
            const user = await this.userModel.findOne({email, isActive: true, verified: true})
            if(user) throw new BadRequestException('the user has already exists') 
        }

        private async generatAccessToken(payload: { sub: string, userRole: string }) {
            const accessToken = await this.jwtService.signAsync(payload, accessTokenConfig)
            return accessToken
        }

        private async createRefreshToken(payload: { sub: string, family?: string }, browserInfo?: string) {
            if(!payload.family) {
                payload.family = uuidv4()
            }

            const refreshToken = await this.jwtService.sign(payload, refreshTokenConfig)

            await this.saveRefreshToken({
                userId: payload.sub,
                refreshToken,
                family: payload.family,
                browserInfo
            })

            return refreshToken
        }


        private async saveRefreshToken(refreshTokenInfos: {
            userId: string,
            refreshToken: string
            family: string,
            browserInfo?: string
        }) {
            const expiresAt = getTokenExpirationDate()
            return this.refreshTokenModel.create({
                ...refreshTokenInfos,
                expiresAt
            })
        }

        private async validateRefreshToken(refreshToken: string, refreshTokenContent: RefreshTokenPayload): Promise<boolean> {
            const userTokens = await this.refreshTokenModel.findOne({ userId: refreshTokenContent.sub, refreshToken })

            const isValidRefreshToken = userTokens.refreshToken.length > 0

            if(!isValidRefreshToken) {
                await this.removeRefreshTokenFamilyIfCompromised(
                    refreshTokenContent.sub,
                    refreshTokenContent.tokenFamily
                )

                throw new InvalidRefreshTokenException()
            }

            return true
        }

        private async removeRefreshTokenFamilyIfCompromised(userId: string, tokenFamily: string) {
            const familyTokens = await this.refreshTokenModel.findOne({userId, family: tokenFamily})
            const { family } = familyTokens

            if(family.length > 0) {
                return this.refreshTokenModel.findOneAndDelete({family })
            }
        } 

        private async rotateRefreshToken(refreshToken: string, refreshTokenContent: RefreshTokenPayload, browserInfo?: string) {
            await this.refreshTokenModel.findOneAndDelete({refreshToken})

            const newRefreshToken = await this.createRefreshToken({
               sub: refreshTokenContent.sub,
               family: refreshTokenContent.tokenFamily
            },
            browserInfo
            )

            return newRefreshToken
        }

        private async getUserRole(userId: string) {
            const user = await this.userModel.findById({id: userId})
            return user.role
        }

        private isUserBlocked(user: UserDocument) {
            if(user.blockExpires > new Date()) {
                throw new BadRequestException('User Blocked Please Try Later')
            }
        }

        private async checkPasswordAttemps(user: any, password: any) {
            const isCorrectPassword = await user.comparPassword(password)

            if(!isCorrectPassword) {
                user.confirmationAttemptsCount += 1
                await user.save()

                if(user.confirmationAttemptsCount >= global.LOGIN_ATTEMPTS_TO_BLOCK) {
                    user.blockExpires = addHours(Date.now(), global.HOUR_TO_BLOCK)
                    await user.save()
                    throw new BadRequestException('User Blocked, Please Try After 1 Hour')
                }
                throw new UnauthorizedException()
            }
            user.confirmationAttemptsCount = 0
            await user.save()
        }

        private generateRandomOtp(length = 6): number {
            const token = Array(length)
            .fill(null)
            .map(() => Math.floor(Math.random() * 10))
            .join('')
            return parseInt(token)
        }
}
