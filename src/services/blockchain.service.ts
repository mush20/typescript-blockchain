import { Service } from 'typedi';
import { Blockchain } from '@app/models/blockchain';
import { Block } from '@app/models/block';
import * as SHA256 from 'crypto-js/sha256';

const DIFFICULTY: number = 4;

@Service()
export class BlockchainService<T> {

    private _blockchain: Blockchain = new Blockchain();

    // validates a chain
    protected isValid(chain: Block<T>[]): boolean {

        // Tests genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        // Tests blocks
        for (let index: number = 1; index < chain.length; index++) {
            const block: Block = chain[index];
            const previous: Block = chain[index - 1];

            if (block.previousHash !== previous.hash ||
                block.hash !== this.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    getChain(): Block[] {
        return this._blockchain.chain;
    }

    mine(data): Block {
        let timestamp: number = 0;
        const previousHash: string = this._blockchain.last().hash;
        let nonce: number = 0;
        let hash: string = '';

        while(hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY)) {
            nonce++;
            timestamp = Date.now();
            hash = this.hash(timestamp, previousHash, nonce, data);
        }

        return this._blockchain.addBlock(new Block(timestamp, previousHash, hash, nonce, data));
    }

    hash<T = any>(timestamp: number, previousHash: string, nonce: number, data: T): string {
        return SHA256(`${timestamp}${previousHash}${data}${nonce}`).toString();
    }

    blockHash<T = any>(block: Block<T>): string {
        const {timestamp, previousHash, nonce, data} = block;
        return this.hash(timestamp, previousHash, nonce, data );
    }

    // Replaces the chain when longer and valid
    replace(newChain: Block<T>[]): void {
        if (newChain.length <= this._blockchain.chain.length) {
            return;
        } else if (!this.isValid(newChain)){
            return;
        }

        console.log('Replacing the chain');
        this._blockchain.chain = newChain;
    }

}