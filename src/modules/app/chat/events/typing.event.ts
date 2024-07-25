import { SocketEventNames } from '../../../../constants';
import BaseSocketEvent from 'modules/socket/events/base.event';
import { Socket } from 'socket.io';

export type TypingSocketEventInput = {
    chatId: number;
    content: string;
};

type TypingSocketEventData = {
    content: string;
};

export default class TypingSocketEvent extends BaseSocketEvent<TypingSocketEventData> {
    chatId: number;
    content: string;

    constructor(socket: Socket, data: TypingSocketEventInput) {
        super(socket);

        this.chatId = data.chatId;
        this.content = data.content;
    }

    protected GetName(): string {
        return SocketEventNames.TYPING;
    }

    protected GetData(): TypingSocketEventData {
        return {
            content: this.content,
        };
    }
}
