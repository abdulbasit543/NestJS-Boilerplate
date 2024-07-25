import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import DatabaseService from 'database/database.service';
import { Logger } from 'helpers/logger.helper';

@Injectable()
export default class CronService {
    constructor(private _dbService: DatabaseService) {}

    @Cron(CronExpression.EVERY_HOUR, { name: 'test' })
    HandleTestMessage() {
        Logger.Info('===> Generated from test cron <===', '[CRON]');
    }
}
