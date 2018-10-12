import { Wallet } from '@app/models/wallet';
import { TransactionPoolService } from './transaction-pool.service';
import { Transaction } from '@app/models';
import { TransactionService } from './transaction.service';

describe('Service: TransactionPool', () => {

    const wallet: Wallet = new Wallet(500);
    const to: string = 'r3c1p13nt';
    const amount: number = 50;
    let service: TransactionPoolService;
    let txService: TransactionService;
    let tx: Transaction;

    beforeEach(() => {
        service = new TransactionPoolService();
        txService = new TransactionService();
        tx = txService.createTransaction(wallet, to, amount).left;
        service.addOrUpdateTransaction(tx);
    });


    it('should not duplicate a transaction', () => {

        service.addOrUpdateTransaction(tx);
        service.addOrUpdateTransaction(tx);
        service.addOrUpdateTransaction(tx);
        service.addOrUpdateTransaction(tx);
        service.addOrUpdateTransaction(tx);

        expect(service.getExistingTransaction(wallet.publicKey)).toEqual(tx);
    });

    it('should updateTransaction a transaction', () => {

        const old = JSON.stringify(tx);

        let expected = service.getExistingTransaction(wallet.publicKey);
        expect(old).toEqual(JSON.stringify(expected));

        tx = txService.updateTransaction(tx, wallet, to, 10).left;
        service.addOrUpdateTransaction(tx);

        expected = service.getExistingTransaction(wallet.publicKey);

        expect(old).not.toEqual(JSON.stringify(expected));
        expect(JSON.stringify(tx)).toEqual(JSON.stringify(expected));
    });

    describe('creating a transaction', () => {

        beforeEach(() => {
            service = new TransactionPoolService();
            txService = new TransactionService();
            service.createTransaction(wallet, to, amount);
        });

        describe(' and sending the same transaction again', () => {

            beforeEach(() => {
                service.createTransaction(wallet, to, amount);
            });

            it('should double the amount of the original transaction', () => {

                const expected = service.getExistingTransaction(wallet.publicKey).outputs.find(o => o.address === wallet.publicKey).amount;

                expect(expected).toEqual(wallet.balance - (amount * 2));
            });

            it('should clone the outputs for the recipient', () => {

                const expected = service.getExistingTransaction(wallet.publicKey).outputs
                    .filter(o => o.address === to).map(o => o.amount);

                expect(expected).toEqual([amount, amount]);

            });
        });

        // TODO: issue with ec and verifyTransaction
        describe('valid invalid transactions', () => {
            let validTransactions;

            beforeEach(() => {
                validTransactions = [...service.transactions];
                for (let i = 1; i < 7; i++) {
                    const w = new Wallet(10 * i);
                    const tx = service.createTransaction(w, '4ddr3ss', 10).left;

                    if (i % 2 === 0) {
                        tx.input.amount = 99999;
                    } else {
                        validTransactions.push(tx);
                    }
                }
            });

            it('should return only valid transactions', () => {

                expect(JSON.stringify(validTransactions)).toEqual(JSON.stringify(service.getValidTransactions()));
                expect(validTransactions.length).toEqual(service.getValidTransactions().length);

            });

        });
    });

});
