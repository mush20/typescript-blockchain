import { Block } from './block';

export class Blockchain<T = any> {

    private _chain: Block<T>[];

    constructor() {
        this._chain = [Block.genesis()];
    }

    get chain(): Block<T>[] {
        return this._chain;
    }

    set chain(value: Block<T>[]) {
        this._chain = value;
    }

    addBlock(block: Block): Block {
        this._chain.push(block);
        return block;
    }

    // Returns the last block
    last(): Block {
        return this._chain[this._chain.length - 1];
    }

}