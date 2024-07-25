import { EmailTemplates, NotificationType } from '../../constants';

export enum SQSMessageType {
    EMAIL = 'EMAIL',
    NOTIFICATION = 'NOTIFICATION',
    CERTIFICATE = 'CERTIFICATE',
}

export type SQSMessagePayload<T> = {
    type: SQSMessageType;
    payload: T;
};

export type SQSSendEmailArgs<T> = {
    template: EmailTemplates;
    subject: string;
    email: string;
    data: T;
};

export type SQSSendNotificationArgs<T> = {
    type: NotificationType;
    userId: number;
    data: T;
};

export type SQSGenerateCertificateArgs = {
    name: string;
    date: string;
    course: string;
    instructor: string;
    studentId: number;
    courseId: number;
};
