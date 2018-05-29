import { Service } from 'typedi';
import { Wallet } from '@app/models/wallet';
import { Transaction, TransactionOutput } from '@app/models/transaction';

@Service()
export class TransactionService {

    create(from: Wallet, to: string, amount: number): { tx: Transaction | null, message: string } {

        let tx: Transaction | null = null;

        if (amount > from.balance) {
            return {tx, message: `Amount ${amount} exceeds balance`};
        }

        tx = new Transaction();

        tx.outputs.push(...[
            new TransactionOutput(from.balance - amount, from.publicKey),
            new TransactionOutput(amount, to)
        ]);

        return {tx, message: 'Transaction successful'};
    }

}