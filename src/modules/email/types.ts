import { EmailTemplates } from '../../constants';

export type SendEmailArgs<T> = {
    template: EmailTemplates;
    subject: string;
    email: string;
    data: T;
};

export type WelcomeEmailPayload = {
    name: string;
    link: string;
};
