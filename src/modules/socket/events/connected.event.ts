import { SocketEventNames } from '../../../constants';
import BaseSocketEvent from './base.event';

export default class SocketConnectedEvent extends BaseSocketEvent {
    protected GetName(): string {
        return SocketEventNames.CONNECTED;
    }

    protected GetData(): {} {
        return {};
    }
}
