import { Block } from './block';
import * as SHA256 from 'crypto-js/sha256';

describe('Model: Block', () => {

    let genesis: Block;
    let block: Block;
    let mine: Block;
    const data: string = 'foo';
    const timestamp: number = Date.now();
    let hash: string;

    beforeEach(() => {
        genesis = Block.genesis();
        block = new Block(timestamp, 'bar', 'baz', data);
        mine = Block.mine(genesis, data);
        hash = SHA256(`${mine.timestamp}${genesis.hash}${data}`).toString();
    });

    it('should create an instance of Block', () => {

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual('bar');
        expect(block.hash).toEqual('baz');
        expect(block.data).toEqual(data);
    });

    it('should create a genesis block', () => {
        const expected: string = `Block -
            Timestamp       : 0
            Previous Hash   : -----
            Hash            : f1r57-h45h
            Data            : ${[]}
        `;

        expect(genesis.toString()).toEqual(expected);
    });

    it('should mine a block', () => {

        expect(mine.hash).toEqual(hash);
        expect(mine.data).toEqual('foo');
        expect(mine.previousHash).toEqual(genesis.hash);
        expect(mine.timestamp).not.toBeNull();
    });

    it('should generate a hash from a block', () => {

        expect(Block.blockHash(mine)).toEqual(hash);
    });
});