import { Block } from '@app/models/block';
import { Message } from '@app/models/message';
import { MessageTypes } from '@app/utils';

export class MessageBlockchain extends Message<Block[]> {

    constructor(data: Block[]) {
        super(MessageTypes.BLOCK_CHAIN, data);
    }
}