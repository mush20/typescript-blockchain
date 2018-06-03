import { Service } from 'typedi';
import * as SHA256 from 'crypto-js/sha256';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
import * as crypto from 'crypto';

@Service()
export class UtilService {

    static hash<T>(data: T): string {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
    }

    static keyPair() {
        return ec.genKeyPair();
    }

    static generateSignature<T>(privateKey: string, data: T) {
        const key = ec.keyFromPrivate(privateKey);
        return key.sign(UtilService.hash(data)).toDER();
    }

    static verifySignature<T>(publicKey: string, signature: string, data: T): boolean {

        return ec.keyFromPublic(publicKey, 'hex').verify(UtilService.hash(data), signature);
    }

}