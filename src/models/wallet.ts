import { Keypair } from './keypair';

export class Wallet {

    readonly keyPair: Keypair = new Keypair();
    readonly publicKey: string;

    constructor(public balance: number = 0) {
        this.publicKey = this.keyPair.publicKey.encode('hex');
    }

    toString() {
        return `Wallet -
        Public Key  : ${this.publicKey.toString()}
        Balance     : ${this.balance}
        `
    }
}