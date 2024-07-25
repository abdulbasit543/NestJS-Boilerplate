import { Injectable } from '@nestjs/common';
import DatabaseService from 'database/database.service';
import { AuthModel } from 'modules/app/auth/auth.service';
import SocketConnectedEvent from './events/connected.event';
import SocketDisconnectedEvent from './events/disconnected.event';
import SocketService from './socket.service';

@Injectable()
export default class SocketEventHandler {
    constructor(private _socketService: SocketService, private _dbService: DatabaseService) {}

    async OnConnectedEvent(event: SocketConnectedEvent) {
        const auth: AuthModel = event.GetSocket()['auth'];
        await this._socketService.SetSocket(event.GetSocket().id, auth.id);
        return true;
    }

    async OnDisconnectedEvent(event: SocketDisconnectedEvent) {
        const auth: AuthModel = event.GetSocket()['auth'];
        await this._socketService.RemoveSocket(event.GetSocket().id, auth.id);
        return true;
    }
}
