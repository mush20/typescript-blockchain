import * as uuid from 'uuid/v1';

export class Transaction {

    txId: string = uuid();
    input = null;
    outputs: TransactionOutput[] = [];
}

export class TransactionOutput {

    constructor(public ammount: number, public address: string) {}
}