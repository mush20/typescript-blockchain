import { TransactionService } from './transaction.service';
import { Wallet } from '@app/models/wallet';
import { TransactionOutput, Transaction } from '@app/models';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

describe('Service: Transaction', () => {

    const wallet: Wallet = new Wallet();
    const to: string = 'r3c1p13nt';
    const trxService: TransactionService = new TransactionService();

    it('should not create a transaction as the balance is insufficient', () => {
        wallet.balance = 500;
        const amount: number = 50000;
        const {transaction, message} = trxService.create(wallet, to, amount);

        expect(transaction).toBeNull();
        expect(message).toEqual(`Amount ${amount} exceeds balance`);

    });

    describe('', () => {

        let response: { transaction: Transaction, message: string };
        let amount: number = 50;
        let balance: number;

        beforeEach(() => {
            wallet.balance = 500000;
            amount = 50;
            balance = wallet.balance - amount;
            response = trxService.create(wallet, to, amount);
        });

        it('should create a new transaction', () => {

            expect(response.transaction).not.toBeNull();
            expect(response.message).toEqual('Transaction created successfully');

            expect(response.transaction.outputs.length).toEqual(2);
            expect(response.transaction.outputs.filter((out: TransactionOutput) => out.address === wallet.publicKey && out.amount === balance).length).toEqual(1);
            expect(response.transaction.outputs.filter((out: TransactionOutput) => out.address === to && out.amount === amount).length).toEqual(1);

        });

        it('should have the correct input after signed', () => {

            expect(response.transaction).not.toBeNull();
            expect(response.message).toEqual('Transaction created successfully');

            expect(response.transaction.input.amount).toEqual(wallet.balance);
        });

        describe('updating transactions', () => {

            let nextAmount, nextTo;

            beforeEach(() => {
                nextAmount = 20;
                nextTo = 'n3xt-r3c1p13nt';
                response = trxService.update(response.transaction, wallet, nextTo, nextAmount);
            });

            it(`subtract the next amount from sender's output`, () => {

                expect(response.transaction.outputs.find((output) => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);

            });

            it(`outputs an amount for the next recipient`, () => {

                expect(response.transaction.outputs.find((output) => output.address === nextTo).amount).toEqual(nextAmount);

            });
        });

    });

})