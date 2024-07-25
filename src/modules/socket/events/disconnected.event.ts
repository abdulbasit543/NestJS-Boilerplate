import { SocketEventNames } from '../../../constants';
import BaseSocketEvent from './base.event';

export default class SocketDisconnectedEvent extends BaseSocketEvent {
    protected GetName(): string {
        return SocketEventNames.DISCONNECTED;
    }

    protected GetData(): {} {
        return {};
    }
}
