import { Socket } from 'socket.io';

export default abstract class BaseSocketEvent<T = {}> {
    private _socket: Socket;
    private _roomKey: string = 'room';

    constructor(socket: Socket) {
        this._socket = socket;
    }

    protected abstract GetName(): string;

    protected abstract GetData(): T;

    GetSocket(): Socket {
        return this._socket;
    }

    GetRoomKey(id: number): string {
        return this._roomKey + ':' + id;
    }

    JoinRoom(id: number) {
        this._socket.join(this.GetRoomKey(id));
    }

    LeaveRoom(id: number) {
        this._socket.leave(this.GetRoomKey(id));
    }

    Emit(socketId: string) {
        this._socket.to(socketId).emit(this.GetName(), this.GetData());
    }

    BroadcastToRoom(id: number) {
        this._socket.broadcast.to(this.GetRoomKey(id)).emit(this.GetName(), this.GetData());
    }
}
