import { Block } from '@app/models/block';
import { MessageTypes } from '@app/utils';
import { Message } from '@app/models/messages/message';

export class MessageBlockchain extends Message<Block[]> {

    constructor(data: Block[]) {
        super(MessageTypes.BLOCK_CHAIN, data);
    }
}