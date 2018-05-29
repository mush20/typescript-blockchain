import { Block } from './block';

describe('Model: Block', () => {

    const data: string = 'foo';
    const timestamp: number = Date.now();
    let genesis: Block;
    let block: Block;

    beforeEach(() => {
        genesis = Block.genesis();
        block = new Block(timestamp, genesis.hash, 'baz', 0, data);
    });

    it('should create an instance of Block', () => {

        expect(block.timestamp).toEqual(timestamp);
        expect(block.previousHash).toEqual(genesis.hash);
        expect(block.hash).toEqual('baz');
        expect(block.data).toEqual(data);
    });

    it('should create a genesis block', () => {
        const expected: string = `Block -
            Timestamp       : 0
            Previous Hash   : -----
            Hash            : f1r57-h45h
            Nonce           : 0
            Data            : ${[]}
        `;

        expect(genesis.toString()).toEqual(expected);
    });

});