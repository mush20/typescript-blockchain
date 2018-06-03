import { TransactionService } from './transaction.service';
import { Wallet } from '@app/models/wallet';
import { TransactionOutput, Transaction } from '@app/models';
import { Pair } from '@app/utils';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

describe('Service: Transaction', () => {

    const wallet: Wallet = new Wallet();
    const to: string = 'r3c1p13nt';
    const trxService: TransactionService = new TransactionService();

    it('should not create a transaction as the balance is insufficient', () => {
        wallet.balance = 500;
        const amount: number = 50000;
        const {left, right} = trxService.create(wallet, to, amount);

        expect(left).toBeNull();
        expect(right).toEqual(`Amount ${amount} exceeds balance`);

    });

    describe('', () => {

        let response: Pair<Transaction, string>;
        let amount: number = 50;
        let balance: number;

        beforeEach(() => {
            wallet.balance = 500000;
            amount = 50;
            balance = wallet.balance - amount;
            response = trxService.create(wallet, to, amount);
        });

        it('should create a new transaction', () => {

            expect(response.left).not.toBeNull();
            expect(response.right).toEqual('Transaction created successfully');

            expect(response.left.outputs.length).toEqual(2);
            expect(response.left.outputs.filter((out: TransactionOutput) => out.address === wallet.publicKey && out.amount === balance).length).toEqual(1);
            expect(response.left.outputs.filter((out: TransactionOutput) => out.address === to && out.amount === amount).length).toEqual(1);

        });

        it('should have the correct input after signed', () => {

            expect(response.left).not.toBeNull();
            expect(response.right).toEqual('Transaction created successfully');

            expect(response.left.input.amount).toEqual(wallet.balance);
        });

        describe('updating transactions', () => {

            let nextAmount, nextTo;

            beforeEach(() => {
                nextAmount = 20;
                nextTo = 'n3xt-r3c1p13nt';
                response = trxService.update(response.left, wallet, nextTo, nextAmount);
            });

            it(`subtract the next amount from sender's output`, () => {

                expect(response.left.outputs.find((output) => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amount - nextAmount);

            });

            it(`outputs an amount for the next recipient`, () => {

                expect(response.left.outputs.find((output) => output.address === nextTo).amount).toEqual(nextAmount);

            });
        });

    });

})