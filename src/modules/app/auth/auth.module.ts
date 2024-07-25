import { Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import RedisModule from 'core/cache/redis.module';
import AuthService from './auth.service';
import AuthGuard from './auth.guard';

@Module({
    imports: [DatabaseModule, RedisModule],
    exports: [AuthService],
    providers: [AuthService, AuthGuard],
    controllers: [],
})
export default class AuthModule {}
