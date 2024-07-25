import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { UnAuthorizedException } from 'core/exceptions/response.exception';
import { Logger } from 'helpers/logger.helper';
import AuthService from 'modules/app/auth/auth.service';
import { Server, Socket } from 'socket.io';
import SocketConnectedEvent from './events/connected.event';
import SocketDisconnectedEvent from './events/disconnected.event';
import SocketEventHandler from './event.handler.ts';
import { SocketEventNames } from '../../constants';
import ChatStartSocketEvent, { ChatStartSocketEventInput } from 'modules/app/chat/events/chat_start.event';
import ChatSocketEventHandler from 'modules/app/chat/event.handler';
import ChatEndSocketEvent, { ChatEndSocketEventInput } from 'modules/app/chat/events/chat_end.event';
import MessageSocketEvent, { MessageSocketEventInput } from 'modules/app/chat/events/message.event';
import TypingSocketEvent, { TypingSocketEventInput } from 'modules/app/chat/events/typing.event';
import ChatJoinSocketEvent, { ChatJoinSocketEventInput } from 'modules/app/chat/events/chat_join.event';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway()
export default class SocketGateway implements OnGatewayInit<Server>, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private _authService: AuthService,
        private _socketEventHandler: SocketEventHandler,
        @Inject(forwardRef(() => ChatSocketEventHandler))
        private _chatEventHandler: ChatSocketEventHandler,
    ) {}

    static _io: Server;

    afterInit(server: Server) {
        SocketGateway._io = server;
        SocketGateway._io.use(this.socketMiddleware);
        Logger.Trace('Socket gateway enabled', '[SOCKET-IO]');
    }

    async socketMiddleware(socket: Socket, next: Function) {
        let token = socket.handshake.query.authorization as string;
        if (token) {
            let auth = await this._authService.GetSession(token);
            if (auth) {
                socket['auth'] = auth;
                return next();
            }
        }

        let error = new UnAuthorizedException();
        socket._error(error);

        return next(error);
    }

    async handleConnection(client: Socket) {
        Logger.Trace('Socket connected: ', client.id);
        const event = new SocketConnectedEvent(client);
        return await this._socketEventHandler.OnConnectedEvent(event);
    }

    async handleDisconnect(client: Socket) {
        Logger.Trace('Socket disconnected: ', client.id);
        const event = new SocketDisconnectedEvent(client);
        return await this._socketEventHandler.OnDisconnectedEvent(event);
    }

    /* Chat Events */

    @SubscribeMessage(SocketEventNames.CHAT_START)
    async ChatStartEvent(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatStartSocketEventInput) {
        const event = new ChatStartSocketEvent(socket, data);
        return await this._chatEventHandler.OnChatStartEvent(event);
    }

    @SubscribeMessage(SocketEventNames.CHAT_END)
    async ChatEndEvent(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatEndSocketEventInput) {
        const event = new ChatEndSocketEvent(socket, data);
        return await this._chatEventHandler.OnChatEndEvent(event);
    }

    @SubscribeMessage(SocketEventNames.CHAT_JOIN)
    async ChatJoinEvent(@ConnectedSocket() socket: Socket, @MessageBody() data: ChatJoinSocketEventInput) {
        const event = new ChatJoinSocketEvent(socket, data);
        return await this._chatEventHandler.OnChatJoinEvent(event);
    }

    @SubscribeMessage(SocketEventNames.MESSAGE)
    async MessageEvent(@ConnectedSocket() socket: Socket, @MessageBody() data: MessageSocketEventInput) {
        const event = new MessageSocketEvent(socket, data);
        return await this._chatEventHandler.OnMessageEvent(event);
    }

    @SubscribeMessage(SocketEventNames.TYPING)
    async TypingEvent(@ConnectedSocket() socket: Socket, @MessageBody() data: TypingSocketEventInput) {
        const event = new TypingSocketEvent(socket, data);
        return await this._chatEventHandler.OnTypingEvent(event);
    }
}
