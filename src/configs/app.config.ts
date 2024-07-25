import { config } from 'dotenv';
config();

const AppConfig = {
    APP: {
        NAME: 'API',
        PORT: Number(process.env.APP_PORT),
        DEBUG: Boolean(process.env.APP_DEBUG),
        LOG_LEVEL: Number(process.env.APP_LOG_LEVEL),
        TOKEN_EXPIRATION: Number(process.env.APP_TOKEN_EXPIRATION),
    },
    DATABASE: {
        URL: process.env.APP_DATABASE_URL,
    },
    REDIS: {
        HOST: process.env.APP_REDIS_HOST,
        PORT: Number(process.env.APP_REDIS_PORT),
    },
    AWS: {
        ACCESS_KEY: process.env.APP_AWS_ACCESS_KEY,
        SECRET_KEY: process.env.APP_AWS_SECRET_KEY,
        REGION: process.env.APP_AWS_REGION,
        BUCKET: process.env.APP_AWS_BUCKET,
        BUCKET_BASE_URL: process.env.APP_AWS_BUCKET_BASE_URL,
        STS_ROLE_ARN: process.env.APP_AWS_STS_ROLE_ARN,
        QUEUE_URL: process.env.APP_AWS_QUEUE_URL,
        SES_FROM_EMAIL: process.env.APP_AWS_SES_FROM_EMAIL,
    },
    TWILIO: {
        ACCOUNT_SID: process.env.APP_TWILIO_ACCOUNT_SID,
        AUTH_TOKEN: process.env.APP_TWILIO_AUTH_TOKEN,
        FROM_NUMBER: process.env.APP_TWILIO_FROM_NUMBER,
    },
    OAUTH: {
        GOOGLE: process.env.APP_GOOGLE_OAUTH_ENDPOINT,
        APPLE: process.env.APP_APPLE_OAUTH_ENDPOINT,
    },
    AGORA: {
        APP_ID: process.env.APP_AGORA_APP_ID,
        APP_CERTIFICATE: process.env.APP_AGORA_APP_CERTIFICATE,
        LIVE_SESSION_TOKEN_EXPIRATION: Number(process.env.APP_AGORA_LIVE_SESSION_TOKEN_EXPIRATION),
    },
};

export default AppConfig;
