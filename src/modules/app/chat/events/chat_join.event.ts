import { Chat } from '@prisma/client';
import { SocketEventNames } from '../../../../constants';
import BaseSocketEvent from 'modules/socket/events/base.event';
import { Socket } from 'socket.io';

export type ChatJoinSocketEventInput = {
    chatId: number;
};

type ChatJoinSocketEventData = {
    chat: Chat;
};

export default class ChatJoinSocketEvent extends BaseSocketEvent<ChatJoinSocketEventData> {
    chat: Chat;
    chatId: number;

    constructor(socket: Socket, data: ChatJoinSocketEventInput) {
        super(socket);
        this.chatId = data.chatId;
    }

    protected GetName(): string {
        return SocketEventNames.CHAT_JOIN;
    }

    protected GetData(): ChatJoinSocketEventData {
        return {
            chat: this.chat,
        };
    }
}
