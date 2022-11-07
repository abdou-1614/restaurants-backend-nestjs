import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { UserDocument } from "src/user/schema/user.schema";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendUserConfirmationEmail(user: UserDocument, token: string) {
        const url = `${process.env.FRONT_END_URL}/confirm-email/${token}`

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Welcom To Our Restaurant! Confirm Your Email',
            template: '/confirm',
            context: {
                name: user.fullName,
                url
            }
        })
    }
}