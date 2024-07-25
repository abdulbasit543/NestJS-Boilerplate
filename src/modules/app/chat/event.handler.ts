import { Injectable } from '@nestjs/common';
import { ChatEventType, ChatStatus, ChatType } from '@prisma/client';
import { BadRequestException, ForbiddenException, NotFoundException } from 'core/exceptions/response.exception';
import DatabaseService from 'database/database.service';
import SocketGateway from 'modules/socket/socket.gateway';
import SocketService from 'modules/socket/socket.service';
import ChatEndSocketEvent from './events/chat_end.event';
import ChatJoinSocketEvent from './events/chat_join.event';
import ChatStartSocketEvent from './events/chat_start.event';
import MessageSocketEvent from './events/message.event';
import TypingSocketEvent from './events/typing.event';

@Injectable()
export default class ChatSocketEventHandler {
    constructor(private _dbService: DatabaseService, private _socketService: SocketService) {}

    private _socketJoinRoom(socketId: string, room: string) {
        if (SocketGateway._io && SocketGateway._io?.sockets?.sockets.get(socketId)) {
            SocketGateway._io.sockets.sockets.get(socketId)?.join(room);
        }
    }

    async OnChatStartEvent(event: ChatStartSocketEvent) {
        const currentUserId = await this._socketService.GetSocket(event.GetSocket().id);

        const user = await this._dbService.user.findFirst({
            where: { id: event.userId },
            select: { id: true },
        });
        if (!user) throw new NotFoundException('user.not_found');

        const chat = await this._dbService.chat.create({
            data: {
                type: ChatType.INDIVIDUAL,
                status: ChatStatus.ACTIVE,
                creatorId: currentUserId,
                participants: {
                    create: [
                        {
                            userId: currentUserId,
                        },
                        {
                            userId: user.id,
                        },
                    ],
                },
                events: {
                    create: [
                        {
                            type: ChatEventType.SYSTEM_EVENT,
                            content: 'Chat Started',
                        },
                    ],
                },
            },
        });

        event.chatId = chat.id;
        event.chat = chat;

        event.JoinRoom(chat.id);
        const receivingSockets = await this._socketService.GetSocketEntity(user.id);
        receivingSockets.forEach((socket) => {
            this._socketJoinRoom(socket, event.GetRoomKey(chat.id));
        });

        event.BroadcastToRoom(chat.id);

        return chat.id;
    }

    async OnChatEndEvent(event: ChatEndSocketEvent) {
        const currentUserId = await this._socketService.GetSocket(event.GetSocket().id);

        const chat = await this._dbService.chat.findFirst({
            where: { id: event.chatId },
        });
        if (!chat) throw new NotFoundException('chat.not_found');

        const chatParticipant = await this._dbService.chatParticipant.findFirst({
            where: { chatId: chat.id, userId: currentUserId },
            select: { id: true },
        });
        if (!chatParticipant) throw new ForbiddenException('chat.not_a_participant');

        await this._dbService.$transaction(async (tx) => {
            await tx.chat.update({
                where: { id: chat.id },
                data: { status: ChatStatus.CLOSED },
            });

            await tx.chatEvent.create({
                data: {
                    chatId: chat.id,
                    type: ChatEventType.SYSTEM_EVENT,
                    content: 'Chat Ended',
                    senderId: currentUserId,
                },
            });
        });

        event.chatId = chat.id;
        event.chat = chat;

        event.BroadcastToRoom(chat.id);

        return chat.id;
    }

    async OnChatJoinEvent(event: ChatJoinSocketEvent) {
        const currentUserId = await this._socketService.GetSocket(event.GetSocket().id);

        const chat = await this._dbService.chat.findFirst({
            where: { id: event.chatId },
        });
        if (!chat) throw new NotFoundException('chat.not_found');

        const chatParticipant = await this._dbService.chatParticipant.findFirst({
            where: { chatId: chat.id, userId: currentUserId },
            select: { id: true },
        });
        if (!chatParticipant) throw new ForbiddenException('chat.not_a_participant');

        event.chat = chat;
        event.JoinRoom(chat.id);
        event.BroadcastToRoom(chat.id);

        return chat.id;
    }

    async OnTypingEvent(event: TypingSocketEvent) {
        const currentUserId = await this._socketService.GetSocket(event.GetSocket().id);

        const chat = await this._dbService.chat.findFirst({
            where: { id: event.chatId },
        });
        if (!chat) throw new NotFoundException('chat.not_found');

        const chatParticipant = await this._dbService.chatParticipant.findFirst({
            where: { chatId: chat.id, userId: currentUserId },
            select: { id: true },
        });
        if (!chatParticipant) throw new ForbiddenException('chat.not_a_participant');

        event.BroadcastToRoom(chat.id);

        return event.content;
    }

    async OnMessageEvent(event: MessageSocketEvent) {
        const currentUserId = await this._socketService.GetSocket(event.GetSocket().id);

        const chat = await this._dbService.chat.findFirst({
            where: { id: event.chatId },
        });
        if (!chat) throw new NotFoundException('chat.not_found');

        const chatParticipant = await this._dbService.chatParticipant.findFirst({
            where: { chatId: chat.id, userId: currentUserId },
            select: { id: true },
        });
        if (!chatParticipant) throw new ForbiddenException('chat.not_a_participant');

        const isAttachmentMessage = event.attachmentIds && event.attachmentIds.length;

        if (isAttachmentMessage) {
            const media = await this._dbService.media.findMany({
                where: { id: { in: event.attachmentIds } },
            });
            if (media.length !== event.attachmentIds.length) {
                throw new NotFoundException('media.not_found');
            }
        }

        if (!isAttachmentMessage && !event.content) {
            throw new BadRequestException('chat.please_provide_message');
        }

        const chatEvent = await this._dbService.chatEvent.create({
            data: {
                chatId: chat.id,
                content: event.content,
                type: ChatEventType.USER_EVENT,
                senderId: currentUserId,
                ...(isAttachmentMessage && {
                    attachments: {
                        create: event.attachmentIds.map((attachmentId) => ({
                            attachmentId: attachmentId,
                        })),
                    },
                }),
            },
            include: {
                attachments: {
                    include: {
                        attachment: true,
                    },
                },
            },
        });

        event.chatEvent = chatEvent;
        event.BroadcastToRoom(chat.id);

        return chatEvent.id;
    }
}
