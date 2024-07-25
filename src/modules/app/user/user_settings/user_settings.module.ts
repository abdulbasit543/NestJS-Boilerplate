import { Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import UserSettingsController from './user_settings.controller';
import UserSettingsService from './user_settings.service';

@Module({
    imports: [DatabaseModule],
    controllers: [UserSettingsController],
    providers: [UserSettingsService],
    exports: [UserSettingsService],
})
export default class UserSettingsModule {}
