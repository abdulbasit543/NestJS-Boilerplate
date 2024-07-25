import { INestApplication } from '@nestjs/common';
import { Logger } from 'helpers/logger.helper';

export default function InjectLogger(app: INestApplication) {
    app.use(Logger.GetLoggerMiddleware());
}
