import { Module } from '@nestjs/common';
import RedisModule from 'core/cache/redis.module';
import DatabaseModule from 'database/database.module';
import AuthModule from 'modules/app/auth/auth.module';
import ChatModule from 'modules/app/chat/chat.module';
import SocketEventHandler from './event.handler.ts';
import SocketGateway from './socket.gateway';
import SocketService from './socket.service';

@Module({
    imports: [DatabaseModule, AuthModule, RedisModule, ChatModule],
    exports: [SocketGateway, SocketEventHandler, SocketService],
    providers: [SocketGateway, SocketEventHandler, SocketService],
})
export default class SocketModule {}
