import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { UserDocument } from "src/user/schema/user.schema";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmationEmail(user: UserDocument, token: string) {
        const url = `${process.env.FRONT_END_URL}/confirm-email/?token=${token}`

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcom To Our Restaurant! Confirm Your Email',
            from: 'kirakira1614@gmail.com',
            template: 'confirm',
            context: {
                name: user.fullName,
                url
            }
        })
    }

    async sendUserForgetPassword(user: UserDocument, otp: number) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset password OTP',
            from: 'kirakira1614@gmail.com',
            template: 'reset-password',
            context: {
                name: user.fullName,
                otp
            }
        })
    }
}