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
                    host: configService.get<string>('MAIL_HOST'),
                    port: configService.get<number>('MAIL_PORT'),
                    auth: {
                        user: configService.get<string>('MAIL_USERNAME'),
                        pass: configService.get<string>('MAIL_PASSWORD')
                    }
                },
                defaults: {
                    from: `No Reply <${configService.get('MAIL_ADDRESS')}>`
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