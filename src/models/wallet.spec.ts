import { Wallet } from './Wallet';

describe('Model: Wallet', () => {

    let wallet: Wallet;

    beforeEach(() => {
    });

    it('should createTransaction an instance of Wallet', () => {
        wallet = new Wallet();

        expect(wallet.balance).toEqual(0);
        expect(wallet.publicKey).not.toBeNull();
        expect(wallet.toString()).toEqual(`Wallet -
        Public Key  : ${wallet.publicKey.toString()}
        Balance     : ${wallet.balance}
        `)

    });

    it('should createTransaction an instance of Wallet with amount', () => {
        const amount: number = 500;
        wallet = new Wallet(amount);

        expect(wallet.balance).toEqual(amount);

    });

});