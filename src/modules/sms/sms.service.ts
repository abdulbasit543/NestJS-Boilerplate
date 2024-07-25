import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import parsePhoneNumber from 'libphonenumber-js';
import AppConfig from 'configs/app.config';
import { Logger } from 'helpers/logger.helper';
import { SendSMSPayload } from './types';

@Injectable()
export default class SMSService {
    private _smsClient: Twilio = null;

    constructor() {
        if (AppConfig.TWILIO.ACCOUNT_SID && AppConfig.TWILIO.AUTH_TOKEN) {
            this._smsClient = new Twilio(AppConfig.TWILIO.ACCOUNT_SID, AppConfig.TWILIO.AUTH_TOKEN);
        }
    }

    private _getFullyQualifiedPhoneNumber(phone: string) {
        const parsed = parsePhoneNumber(phone);
        return parsed.number;
    }

    async Send(payload: SendSMSPayload) {
        const phone = this._getFullyQualifiedPhoneNumber(payload.phone);
        const result = await this._smsClient.messages.create({
            to: phone,
            body: payload.text,
            from: AppConfig.TWILIO.FROM_NUMBER,
        });
        Logger.Trace(result, '[SMS]');
        Logger.Info(`SMS sent to ${phone} | ID: ${result.sid}`);
    }
}
