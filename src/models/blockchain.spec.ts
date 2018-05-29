import { Block } from './block';
import { Blockchain } from './blockchain';
import config from '../config';

describe('Model: Block', () => {

    const data: string = 'foo';
    let bc, bc2: Blockchain<string>;
    let block: Block;

    beforeEach(() => {
        bc = new Blockchain(4);
        bc2 = new Blockchain(4);
        block = new Block(Date.now(), bc.last().hash, 'baz', 0, config.DIFFICULTY, data);
    });

    it('should start with genesis block', () => {
        expect(bc.last()).toEqual(Block.genesis(4));
    });

    it('should add a new block', () => {

        bc.addBlock(block);
        expect(bc.last().data).toEqual(block.data);
    });

});