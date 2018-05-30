export class TransactionInput {

    readonly timestamp = Date.now();

    constructor(readonly amount: number, readonly address: string, readonly signature) {
    }
}