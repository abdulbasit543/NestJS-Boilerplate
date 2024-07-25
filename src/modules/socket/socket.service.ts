import { Injectable } from '@nestjs/common';
import RedisService from 'core/cache/redis.service';
import DatabaseService from 'database/database.service';

@Injectable()
export default class SocketService {
    constructor(private _cacheService: RedisService, private _dbService: DatabaseService) {}

    private _getSocketKey(socketId: string) {
        return 'SOCKET:' + socketId;
    }

    private _getSocketEntityKey(userId: number) {
        return 'SOCKET-ENTITY:' + userId;
    }

    async SetSocket(socketId: string, userId: number) {
        let promises = [];

        let userSockets = await this.GetSocketEntity(userId);
        let newUserSockets = Array.from(new Set(userSockets || []));

        promises.push(
            this._cacheService.Set(this._getSocketKey(socketId), JSON.stringify(userId)),
            this._cacheService.Set(this._getSocketEntityKey(userId), JSON.stringify(newUserSockets)),
        );

        await Promise.all(promises);
    }

    async GetSocket(socketId: string): Promise<number> {
        return JSON.parse(await this._cacheService.Get(this._getSocketKey(socketId)));
    }

    async GetSocketEntity(userId: number): Promise<string[]> {
        return JSON.parse(await this._cacheService.Get(this._getSocketEntityKey(userId)));
    }

    async RemoveSocket(socketId: string, userId: number) {
        let promises = [];

        let userSockets = await this.GetSocketEntity(userId);
        let newUserSockets = userSockets.filter((socket) => socket !== socketId);

        promises.push(
            this._cacheService.Delete(this._getSocketKey(socketId)),
            this._cacheService.Set(this._getSocketEntityKey(userId), JSON.stringify(newUserSockets)),
        );

        await Promise.all(promises);
    }
}
