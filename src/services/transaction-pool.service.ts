import { Service, Container } from 'typedi';
import { Transaction, TransactionOutput } from '@app/models';
import { TransactionService } from '@app/services/transaction.service';
import { Wallet } from '@app/models/wallet';
import { Pair } from '@app/utils';

@Service()
export class TransactionPoolService {

    readonly transactions: Array<Transaction> = [];
    private _transactionService: TransactionService = Container.get(TransactionService);

    addOrUpdateTransaction(transaction: Transaction): number {

        let trxIndex: number = this.transactions.findIndex((t: Transaction) => t.txId === transaction.txId);

        if (trxIndex >= 0) {
            this.transactions[trxIndex] = transaction;
        } else {
            trxIndex = this.transactions.push(transaction) - 1;
        }

        return trxIndex;
    }

    getExistingTransaction(address: string): Transaction {
        return this.transactions.find((t: Transaction) => t.input.address === address);
    }

    createTransaction(from: Wallet, to: string, amount: number): Pair<Transaction, string> {

        let response: Pair<Transaction, string>;
        let tx: Transaction = this.getExistingTransaction(from.publicKey);

        if (tx) {
            response = this._transactionService.updateTransaction(tx, from, to, amount);
        } else {
            response = this._transactionService.createTransaction(from, to, amount);
        }

        if (response.left) {
            this.transactions[this.addOrUpdateTransaction(response.left)];
        }

        return response;

    }

    getValidTransactions(): Transaction[] {
        return this.transactions.filter((tx: Transaction) => {
            const outputTotal: number = tx.outputs.reduce((total: number, output: TransactionOutput) => total + output.amount, 0);

            if (tx.input.amount !== outputTotal) {
                return;
            }

            if (!this._transactionService.verifyTransaction(tx)) {
                return;
            }

            return tx;

        });
    }
}