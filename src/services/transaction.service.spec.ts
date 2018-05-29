import { TransactionService } from './transaction.service';
import { Wallet } from '@app/models/wallet';
import { TransactionOutput } from '@app/models/transaction';
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

describe('Service: Transaction', () => {

    const wallet: Wallet = new Wallet();
    const to: string = 'r3c1p13nt';
    const trxService: TransactionService = new TransactionService();

    beforeEach(() => {
    });

    it('should not create a transaction as the balance is insufficient', () => {
        wallet.balance = 500;
        const amount: number = 50000;
        const {tx, message} = trxService.create(wallet, to, amount);

        expect(tx).toBeNull();
        expect(message).toEqual(`Amount ${amount} exceeds balance`);

    });

    it('should create a new transaction', () => {
        wallet.balance = 500000;
        const amount: number = 50;
        const balance: number = wallet.balance - amount;
        const {tx, message} = trxService.create(wallet, to, amount);

        expect(tx).not.toBeNull();
        expect(message).toEqual('Transaction successful');

        if(tx) {
            expect(tx.outputs.length).toEqual(2);
            expect(tx.outputs.filter((out: TransactionOutput) => out.address === wallet.publicKey && out.ammount === balance ).length).toEqual(1);
            expect(tx.outputs.filter((out: TransactionOutput) => out.address === to && out.ammount === amount ).length).toEqual(1);
        }

    });
})