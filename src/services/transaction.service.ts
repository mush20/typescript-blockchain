import { Service, Container } from 'typedi';
import { Wallet } from '@app/models/wallet';
import { Transaction, TransactionOutput, TransactionInput } from '@app/models';
import { UtilService } from '@app/services/util.service';
import { ConfigService } from '@app/services/config.service';
import { Pair } from '@app/utils';

@Service()
export class TransactionService {

    private _configService: ConfigService = Container.get(ConfigService);

    // Creates a new transaction
    createTransaction(from: Wallet, to: string, amount: number): Pair<Transaction, string> {

        if (amount > from.balance) {
            return Pair.of(null, `Amount ${amount} exceeds balance`);
        }

        const transaction: Transaction = this.createTransactionFromOutputs(from, [
            new TransactionOutput(from.balance - amount, from.publicKey),
            new TransactionOutput(amount, to)
        ]);

        return Pair.of(transaction, 'Transaction created successfully')
    }

    createRewardTransaction(from: Wallet, to: string): Pair<Transaction, string> {
        let transaction: Transaction = this.createTransactionFromOutputs(from, [
            new TransactionOutput(this._configService.MINE_REWARD, to)
        ]);

        return Pair.of(transaction, 'Rewards created successfully');
    }

    updateTransaction(transaction: Transaction, from: Wallet, to: string, amount): Pair<Transaction, string>  {

        const toOutput: TransactionOutput = transaction.outputs
            .find((output: TransactionOutput) => output.address === from.publicKey);

        if (!toOutput) {
            return Pair.of(null, 'Output not found');
        }

        if (amount > toOutput.amount) {
            return Pair.of(null, `Amount ${amount} exceeds balance`);
        }

        toOutput.amount = toOutput.amount - amount;
        transaction.outputs.push(new TransactionOutput(amount, to));

        this.signTransaction(transaction, from);

        return Pair.of(transaction, 'Transaction updated successfully');

    }

    verifyTransaction(transaction: Transaction): boolean {
        return UtilService.verifySignature(transaction.input.address, transaction.input.signature, transaction.outputs);
    }

    protected signTransaction(transaction: Transaction, from: Wallet): void {
        const signature: string = UtilService.generateSignature(from.privateKey, transaction.outputs);
        transaction.input = new TransactionInput(from.balance, from.publicKey, signature);
    }

    protected createTransactionFromOutputs(from: Wallet, outputs: TransactionOutput[]): Transaction {
        const transaction: Transaction = new Transaction();

        transaction.outputs.push(...outputs);

        this.signTransaction(transaction, from);

        return transaction;
    }

}