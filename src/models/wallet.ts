import { Keypair } from './keypair';

export class Wallet {

    readonly keyPair: Keypair;
    readonly publicKey: any;

    constructor(public balance: number = 0) {
        this.keyPair = Keypair.generate();
        this.publicKey = this.keyPair.publicKey.encode('hex');
    }

    toString() {
        return `Wallet -
        Public Key  : ${this.publicKey.toString()}
        Balance     : ${this.balance}
        `
    }
}