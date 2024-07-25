import { ChatEvent } from '@prisma/client';
import { SocketEventNames } from '../../../../constants';
import BaseSocketEvent from 'modules/socket/events/base.event';
import { Socket } from 'socket.io';

export type MessageSocketEventInput = {
    chatId: number;
    content?: string;
    attachmentIds?: number[];
};

type MessageSocketEventData = {
    chatEvent: ChatEvent;
};

export default class MessageSocketEvent extends BaseSocketEvent<MessageSocketEventData> {
    chatId: number;
    content?: string;
    attachmentIds?: number[];
    chatEvent: ChatEvent;

    constructor(socket: Socket, data: MessageSocketEventInput) {
        super(socket);

        this.chatId = data.chatId;
        this.content = data.content;
        this.attachmentIds = data.attachmentIds;
    }

    protected GetName(): string {
        return SocketEventNames.MESSAGE;
    }

    protected GetData(): MessageSocketEventData {
        return {
            chatEvent: this.chatEvent,
        };
    }
}
