import { Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import MediaController from './media.controller';
import MediaService from './media.service';
import S3Service from './s3.service';

@Module({
    imports: [DatabaseModule],
    exports: [MediaService, S3Service],
    providers: [MediaService, S3Service],
    controllers: [MediaController],
})
export default class MediaModule {}
