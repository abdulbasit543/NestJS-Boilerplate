import { forwardRef, Module } from '@nestjs/common';
import DatabaseModule from 'database/database.module';
import SocketModule from 'modules/socket/socket.module';
import ChatService from './chat.service';
import ChatSocketEventHandler from './event.handler';

@Module({
    imports: [DatabaseModule, forwardRef(() => SocketModule)],
    exports: [ChatService, ChatSocketEventHandler],
    providers: [ChatService, ChatSocketEventHandler],
})
export default class ChatModule {}
