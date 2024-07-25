import { Chat } from '@prisma/client';
import { SocketEventNames } from '../../../../constants';
import BaseSocketEvent from 'modules/socket/events/base.event';
import { Socket } from 'socket.io';

export type ChatStartSocketEventInput = {
    userId: number;
};

type ChatStartSocketEventData = {
    chatId: number;
    chat: Chat;
};

export default class ChatStartSocketEvent extends BaseSocketEvent<ChatStartSocketEventData> {
    userId: number;
    chatId?: number;
    chat?: Chat;

    constructor(socket: Socket, data: ChatStartSocketEventInput) {
        super(socket);
        this.userId = data.userId;
    }

    protected GetName(): string {
        return SocketEventNames.CHAT_START;
    }

    protected GetData(): ChatStartSocketEventData {
        return {
            chatId: this.chatId,
            chat: this.chat,
        };
    }
}
