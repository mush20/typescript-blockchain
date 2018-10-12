import { Service } from 'typedi';
import { Wallet } from '@app/models/wallet';

@Service()
export class WalletService {

    constructor() {

    }

    createWallet(): Wallet {

        return new Wallet();

    }
}