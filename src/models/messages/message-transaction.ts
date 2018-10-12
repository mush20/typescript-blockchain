import { Transaction } from '@app/models/transaction';
import { MessageTypes } from '@app/utils';
import { Message } from '@app/models/messages/message';

export class MessageTransaction extends Message<Transaction> {

    constructor(data: Transaction) {
        super(MessageTypes.TRANSACTION, data);
    }
}