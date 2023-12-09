import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {


    private nodemailer : Mail
    constructor(
        private readonly configService : ConfigService
    ) {

        this.nodemailer = createTransport ({

            service : configService.get('EMAIL_SERVICE'),
            auth : {
                user : configService.get('EMAIL_USER'),
                pass : configService.get('EMAIL_PASSWORD'),
            }
        })

    }

    sendMail(options : Mail.Options) {
        return this.nodemailer.sendMail(options)
    }



}
