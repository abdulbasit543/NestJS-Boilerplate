import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import AppConfig from 'configs/app.config';
import { Consumer, Message as SQSMessage } from '@rxfork/sqs-consumer';
import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { Logger } from 'helpers/logger.helper';
import { SQSMessagePayload, SQSMessageType, SQSSendEmailArgs } from 'modules/queue/types';
import EmailService from 'modules/email/email.service';

async function bootstrap() {
    /* Bootstrap app context */
    const app = await NestFactory.createApplicationContext(AppModule);
    const emailService = app.get(EmailService);

    /* Create SQS client */
    const client = new SQSClient({
        credentials: {
            accessKeyId: AppConfig.AWS.ACCESS_KEY,
            secretAccessKey: AppConfig.AWS.SECRET_KEY,
        },
        region: AppConfig.AWS.REGION,
    });

    /* SQS Message handler */
    const handleMessage = async (message: SQSMessage) => {
        const { type, payload } = JSON.parse(message.Body);
        Logger.Info(
            `Received SQS Message: ${
                message.MessageId
            } of type: ${type} with payload: ${JSON.stringify(payload, null, 4)}`,
            '[QUEUE_PROCESSOR]',
        );

        switch (type) {
            case SQSMessageType.EMAIL:
                await emailService.Send(payload);
                break;
            case SQSMessageType.NOTIFICATION:
                break;
            default:
                Logger.Error(`Unable to handle message with type ${type}`, '[QUEUE_PROCESSOR]');
                break;
        }

        /* Delete the message after it was processed */
        const command = new DeleteMessageCommand({
            QueueUrl: AppConfig.AWS.QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle,
        });
        await client.send(command);
    };

    /* Create SQS consumer */
    const consumer = Consumer.create({
        sqs: client,
        queueUrl: AppConfig.AWS.QUEUE_URL,
        handleMessage,
    });

    consumer.on('error', (err) => {
        Logger.Error(err, '[QUEUE_PROCESSOR]');
    });

    consumer.on('processing_error', (err) => {
        Logger.Error(err, '[QUEUE_PROCESSOR]');
    });

    /* Start SQS consumer */
    consumer.start();
}

bootstrap();
