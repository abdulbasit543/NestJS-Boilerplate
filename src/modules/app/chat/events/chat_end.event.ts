import { SocketEventNames } from '../../../../constants';
import BaseSocketEvent from 'modules/socket/events/base.event';
import { Chat } from '@prisma/client';
import { Socket } from 'socket.io';

export type ChatEndSocketEventInput = {
    chatId: number;
};

export type ChatEndSocketEventData = {
    chat: Chat;
};

export default class ChatEndSocketEvent extends BaseSocketEvent<ChatEndSocketEventData> {
    chatId: number;
    chat: Chat;

    constructor(socket: Socket, data: ChatEndSocketEventInput) {
        super(socket);
        this.chatId = data.chatId;
    }

    protected GetName(): string {
        return SocketEventNames.CHAT_END;
    }

    protected GetData(): ChatEndSocketEventData {
        return {
            chat: this.chat,
        };
    }
}
