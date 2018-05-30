import * as uuid from 'uuid/v1';
import { TransactionOutput } from './transaction-output';
import { TransactionInput } from './transaction-input';

export class Transaction {

    readonly txId: string = uuid();
    input: TransactionInput = null;
    outputs: TransactionOutput[] = [];
}