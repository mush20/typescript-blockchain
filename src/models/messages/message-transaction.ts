import { Transaction } from '@app/models/transaction';
import { Message } from '@app/models/message';
import { MessageTypes } from '@app/utils';

export class MessageTransaction extends Message<Transaction> {

    constructor(data: Transaction) {
        super(MessageTypes.TRANSACTION, data);
    }
}