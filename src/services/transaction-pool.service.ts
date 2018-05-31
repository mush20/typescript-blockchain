import { Service, Container } from 'typedi';
import { Transaction, TransactionOutput } from '@app/models';
import { TransactionService } from '@app/services/transaction.service';
import { Wallet } from '@app/models/wallet';

@Service()
export class TransactionPoolService {

    readonly transactions: Array<Transaction> = new Array();
    private _transactionService: TransactionService = Container.get(TransactionService);

    addOrUpdate(transaction: Transaction): number {

        let trxIndex: number = this.transactions.findIndex((t: Transaction) => t.txId === transaction.txId);

        if (trxIndex >= 0) {
            this.transactions[trxIndex] = transaction;
        } else {
            trxIndex = this.transactions.push(transaction) - 1;
        }

        return trxIndex;
    }

    existingTransaction(address: string): Transaction {
        return this.transactions.find((t: Transaction) => t.input.address === address);
    }

    createTransaction(from: Wallet, to: string, amount: number): { transaction: Transaction, message: string } {

        let response: { transaction: Transaction, message: string };
        let tx: Transaction = this.existingTransaction(from.publicKey);

        if (tx) {
            response = this._transactionService.update(tx, from, to, amount);
        } else {
            response = this._transactionService.create(from, to, amount);
        }

        if (response.transaction) {
            this.transactions[this.addOrUpdate(response.transaction)];
        }

        return response;

    }

    validTransactions(): Transaction[] {
        return this.transactions.filter((tx: Transaction) => {
            const outputTotal: number = tx.outputs.reduce((total: number, output: TransactionOutput) => total + output.amount, 0);

            if (tx.input.amount !== outputTotal) {
                return;
            }

            if (!this._transactionService.verify(tx)) {
                return;
            }

            return tx;

        });
    }
}