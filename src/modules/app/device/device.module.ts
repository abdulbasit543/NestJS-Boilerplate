import { Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import DeviceController from './device.controller';
import DeviceService from './device.service';

@Module({
    imports: [DatabaseModule],
    exports: [DeviceService],
    providers: [DeviceService],
    controllers: [DeviceController],
})
export default class DeviceModule {}
