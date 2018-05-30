import { Service, Container } from 'typedi';
import { Blockchain } from '@app/models/blockchain';
import { Block } from '@app/models/block';
import * as SHA256 from 'crypto-js/sha256';
import { ConfigService } from './config.service';


@Service()
export class BlockchainService<T = any> {

    private _blockchain: Blockchain;

    private _configService: ConfigService = Container.get(ConfigService);

    constructor() {
        this._blockchain = new Blockchain(this._configService.DIFFICULTY);
    }

    getChain(): Block[] {
        return this._blockchain.chain;
    }

    mine(data): Block {
        let timestamp: number;
        const previousBlock: Block = this._blockchain.last();
        const previousHash: string = previousBlock.hash;
        let difficulty: number = previousBlock.difficulty;
        let nonce: number = 0;
        let hash: string;

        do {
            nonce++;
            timestamp = Date.now();
            difficulty = this.adjustDifficulty(previousBlock, timestamp);
            hash = this.generateHash(timestamp, previousHash, nonce, difficulty, data);
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty))

        return this._blockchain.addBlock(new Block(timestamp, previousHash, hash, nonce, difficulty, data));
    }

    // Replaces the chain when longer and valid
    replace(newChain: Block<T>[]): void {
        if (newChain.length <= this._blockchain.chain.length) {
            return;
        } else if (!this.isValid(newChain)) {
            return;
        }

        console.log('Replacing the chain');
        this._blockchain.chain = newChain;
    }

    protected adjustDifficulty(previous: Block, timestamp: number): number {
        let {difficulty} = previous;

        return previous.timestamp + this._configService.MINE_RATE > timestamp ? difficulty + 1 : difficulty - 1;
    }

    protected generateHash<T = any>(timestamp: number, previousHash: string, nonce: number, difficulty: number, data: T): string {
        return SHA256(`${timestamp}${previousHash}${data}${nonce}${difficulty}`).toString();
    }

    protected generateBlockHash<T = any>(block: Block<T>): string {
        const {timestamp, previousHash, nonce, difficulty, data} = block;
        return this.generateHash(timestamp, previousHash, nonce, difficulty, data);
    }

    // validates a chain
    protected isValid(chain: Block<T>[]): boolean {

        // Tests genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis(this._configService.DIFFICULTY))) {
            return false;
        }

        // Tests blocks
        for (let index: number = 1; index < chain.length; index++) {
            const block: Block = chain[index];
            const previous: Block = chain[index - 1];

            if (block.previousHash !== previous.hash ||
                block.hash !== this.generateBlockHash(block)) {
                return false;
            }
        }

        return true;
    }
}