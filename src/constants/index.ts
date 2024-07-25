export enum EmailTemplates {
    WELCOME = 'WELCOME',
}

export enum NotificationType {
    COURSE_PURCHASED = 'COURSE_PURCHASED',
}

export enum EventType {
    GENERATE_CERTIFICATE = 'GENERATE_CERTIFICATE',
}

export const AVAILABILITY_DAYS = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

export const DEFAULT_AVAILABLITY = {
    DAYS: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    TIMESLOTS: [
        { start: '09:00', end: '14:00' },
        { start: '15:00', end: '18:00' },
    ],
};

export const QUIZ_CLEARENCE_PERCENTAGE = 60;

export * from './socket';
