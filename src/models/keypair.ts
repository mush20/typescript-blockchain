import { UtilService } from '@app/services/util.service';


export class Keypair {

    readonly key = UtilService.keyPair();

    get publicKey() {
        return this.key.getPublic()
    }

    get privateKey() {
        return this.key.getPrivate('hex');
    }
}