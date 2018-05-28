import { Block } from './block';
import * as SHA256 from 'crypto-js/sha256';

describe('Model: Block', () => {

    it('should create an instance of Block', () => {
        const timestamp: number = Date.now();
        const block = new Block(timestamp, 'bar', 'baz', 'zaz');

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual('bar');
        expect(block.hash).toEqual('baz');
        expect(block.data).toEqual('zaz');
    });

    it('should create a genesis block', () => {
        const expected: string = `Block -
            Timestamp       : 0
            Previous Hash   : -----
            Hash            : f1r57-h45h
            Data            : ${[]}
        `;

        expect(Block.genesis().toString()).toEqual(expected);
    });

    it('should mine a block', () => {

        const data: string = 'foo';
        const genesis: Block = Block.genesis();
        const block: Block = Block.mine(genesis, 'foo');
        const hash: string = SHA256(`${block.timestamp}${genesis.hash}${data}`).toString();

        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual('foo');
        expect(block.previousHash).toEqual(genesis.hash);
        expect(block.timestamp).not.toBeNull();
    });
});