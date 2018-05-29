import { Block } from './block';

export class Blockchain<T = any> {

    private _chain: Block<T>[];

    constructor() {

        this._chain = [Block.genesis()];
    }

    get chain(): Block[] {
        return this._chain;
    }

    addBlock(data: T): Block {
        const block: Block = Block.mine(this.last(), data);
        this._chain.push(block);
        return block;
    }

    // Returns the last block
    last(): Block {
        return this._chain[this._chain.length - 1];
    }

    // validates a chain
    isValid(chain: Block<T>[]): boolean {

        // Tests genesis block
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        // Tests blocks
        for (let index: number = 1; index < chain.length; index++) {
            const block: Block = chain[index];
            const previous: Block = chain[index - 1];

            if (block.previousHash !== previous.hash ||
            block.hash !== Block.blockHash(block)) {
                return false;
            }
        }

        return true;
    }

    // Replaces the chain when longer and valid
    replace(newChain: Block<T>[]): void {
        if (newChain.length <= this._chain.length) {
            console.log('The chain is not longer');
            return;
        } else if (!this.isValid(newChain)){
            console.log('The chain is not valid');
            return;
        }

        console.log('Replacing the chain');
        this._chain = newChain;
    }
}