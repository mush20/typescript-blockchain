import { Service } from 'typedi';

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
import * as crypto from 'crypto';

@Service()
export class UtilService {

    static generateHash<T = any>(data: T): string {
        return crypto
            .createHash('sha256')
            .update(JSON.stringify(data))
            .digest('hex');
    }

    static generateKeyPair() {
        return ec.genKeyPair();
    }

    static generateSignature<T>(privateKey: string, data: T) {
        const key = ec.keyFromPrivate(privateKey);
        return key.sign(UtilService.generateHash(data)).toDER();
    }

    static verifySignature<T>(publicKey: string, signature: string, data: T): boolean {

        return ec.keyFromPublic(publicKey, 'hex').verify(UtilService.generateHash(data), signature);
    }

}