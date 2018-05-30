import { Service } from 'typedi';
import { Wallet } from '@app/models/wallet';
import { Transaction, TransactionOutput, TransactionInput } from '@app/models';
import { UtilService } from '@app/services/util.service';

@Service()
export class TransactionService {

    create(from: Wallet, to: string, amount: number): { transaction: Transaction, message: string } {

        let transaction: Transaction = null;

        if (amount > from.balance) {
            return {transaction, message: `Amount ${amount} exceeds balance`};
        }

        transaction = new Transaction();

        transaction.outputs.push(...[
            new TransactionOutput(from.balance - amount, from.publicKey),
            new TransactionOutput(amount, to)
        ]);

        this.sign(transaction, from);

        return {transaction, message: 'Transaction created successfully'};
    }

    verify(transaction: Transaction): boolean {
        return UtilService.verifySignature(transaction.input.address, transaction.input.signature, UtilService.hash(transaction.outputs));
    }

    update(transaction: Transaction, from: Wallet, to: string, amount): { transaction: Transaction, message: string } {

        const toOutput: TransactionOutput = transaction.outputs.find((output: TransactionOutput) => output.address === from.publicKey);

        if(!toOutput) {
            return {transaction: null, message: 'Output not found'};
        }

        if(amount > toOutput.amount) {
            return {transaction: null, message: `Amount ${amount} exceeds balance`};
        }

        toOutput.amount = toOutput.amount - amount;
        transaction.outputs.push(new TransactionOutput(amount, to));

        this.sign(transaction, from);

        return {transaction, message: 'Transaction updated successfully'};

    }

    protected sign(transaction: Transaction, from: Wallet): void {
        const signature: string = UtilService.hash(transaction.outputs);
        transaction.input = new TransactionInput(from.balance, from.publicKey, signature);
    }

}