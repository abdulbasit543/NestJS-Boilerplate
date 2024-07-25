import { CacheModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import AppConfig from 'configs/app.config';
import RedisService from './redis.service';

@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: AppConfig.REDIS.HOST,
            port: AppConfig.REDIS.PORT,
        }),
    ],
    exports: [RedisService],
    providers: [RedisService],
})
export default class RedisModule {}
