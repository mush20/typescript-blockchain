import { Service } from 'typedi';
import { Blockchain } from '@app/models/blockchain';
import { Block } from '@app/models/block';

const bc: Blockchain = new Blockchain();

@Service()
export class BlockchainService {

    getChain(): Block[] {
        return bc.chain;
    }

    mine(data): Block {
        return bc.addBlock(data);
    }

    replace(chain: Block[]) {
        bc.replace(chain);
    }

}