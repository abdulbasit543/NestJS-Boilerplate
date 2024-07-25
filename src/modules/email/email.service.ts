import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable } from '@nestjs/common';
import AppConfig from 'configs/app.config';
import { EmailTemplates } from '../../constants';
import { Logger } from 'helpers/logger.helper';
import { SendEmailArgs } from './types';

/* Import email templates here */
import WelcomeTemplate from './templates/welcome';

const TEMPLATES: { [key in keyof typeof EmailTemplates]: (data: any) => string } = {
    WELCOME: WelcomeTemplate,
};

@Injectable()
export default class EmailService {
    private _sesClient: SESClient = null;

    constructor() {
        this._sesClient = new SESClient({
            credentials: {
                accessKeyId: AppConfig.AWS.ACCESS_KEY,
                secretAccessKey: AppConfig.AWS.SECRET_KEY,
            },
            region: AppConfig.AWS.REGION,
        });
    }

    async Send(args: SendEmailArgs<any>) {
        const command = new SendEmailCommand({
            Destination: { ToAddresses: [args.email] },
            Source: AppConfig.AWS.SES_FROM_EMAIL,
            Message: {
                Subject: { Data: args.subject, Charset: 'utf8' },
                Body: { Html: { Data: TEMPLATES[args.template](args.data), Charset: 'utf8' } },
            },
        });
        const result = await this._sesClient.send(command);
        Logger.Debug(result, '[EMAIL]');
        Logger.Info(`Email sent to ${args.email} of type ${args.template}`, '[EMAIL]');
    }
}
