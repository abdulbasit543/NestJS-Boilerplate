import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import DatabaseModule from 'database/database.module';
import CronService from './cron.service';

@Module({
    imports: [ScheduleModule.forRoot(), DatabaseModule],
    providers: [CronService],
})
export default class CronModule {}
