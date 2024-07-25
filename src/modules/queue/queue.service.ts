import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import AppConfig from 'configs/app.config';
import { Logger } from 'helpers/logger.helper';
import {
    SQSGenerateCertificateArgs,
    SQSMessageType,
    SQSSendEmailArgs,
    SQSSendNotificationArgs,
} from './types';

@Injectable()
export default class QueueService {
    private _sqsClient: SQSClient = null;
    constructor() {
        this._sqsClient = new SQSClient({
            credentials: {
                accessKeyId: AppConfig.AWS.ACCESS_KEY,
                secretAccessKey: AppConfig.AWS.SECRET_KEY,
            },
            region: AppConfig.AWS.REGION,
        });
    }

    async EnqueueEmail(args: SQSSendEmailArgs<any>) {
        const command = new SendMessageCommand({
            QueueUrl: AppConfig.AWS.QUEUE_URL,
            MessageBody: JSON.stringify({ type: SQSMessageType.EMAIL, payload: args }),
        });
        const result = await this._sqsClient.send(command);
        Logger.Info(`Email enqueued: ${args.template} | ID: ${result.MessageId}`, '[QUEUE]');
    }

    async EnqueueNotification(args: SQSSendNotificationArgs<any>) {
        const command = new SendMessageCommand({
            QueueUrl: AppConfig.AWS.QUEUE_URL,
            MessageBody: JSON.stringify({ type: SQSMessageType.NOTIFICATION, payload: args }),
        });
        const result = await this._sqsClient.send(command);
        Logger.Info(`Notification enqueued: ${args.type} | ID: ${result.MessageId}`, '[QUEUE]');
    }

    async EnqueueCertificate(args: SQSGenerateCertificateArgs) {
        const command = new SendMessageCommand({
            QueueUrl: AppConfig.AWS.QUEUE_URL,
            MessageBody: JSON.stringify({ type: SQSMessageType.CERTIFICATE, payload: args }),
        });
        const result = await this._sqsClient.send(command);
        Logger.Info(`Certificate enqueued | ID: ${result.MessageId}}`, '[QUEUE]');
    }
}
