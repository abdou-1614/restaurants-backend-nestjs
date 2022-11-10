import { MailService } from './mail.service';
import { MailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    host: 'smtp.sendgrid.net',
                    auth: {
                        user: 'apikey',
                        pass: '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'
                    }
                },
                defaults: {
                    from: `No Reply kirakira@gmail.com`
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            })
        })
    ],
    providers: [MailService],
    exports: [MailService]
})
export class MailModule {}