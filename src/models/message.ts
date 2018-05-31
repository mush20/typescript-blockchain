import { MessageTypes } from '@app/utils';

export class Message<T = any> {

    constructor(readonly type: MessageTypes, public data: T) {}
}