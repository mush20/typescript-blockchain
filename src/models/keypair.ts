const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

export class Keypair {

    readonly key = ec.genKeyPair();

    constructor() {}

    get publicKey() {
        return this.key.getPublic()
    }

    static generate(): Keypair {
        return new this();
    }
}