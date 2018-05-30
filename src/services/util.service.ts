import { Service } from 'typedi';
import * as SHA256 from 'crypto-js/sha256';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

@Service()
export class UtilService {

    static hash<T>(data: T): string {
        return SHA256(JSON.stringify(data)).toString();
    }

    static keyPair() {
        return ec.genKeyPair();
    }

    static verifySignature(publicKey: string, signature: string, dataHash: string): boolean {
        return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
    }

}