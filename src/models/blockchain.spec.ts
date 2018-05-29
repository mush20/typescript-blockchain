import { Block } from './block';
import { Blockchain } from './blockchain';

describe('Model: Block', () => {

    const data: string = 'foo';
    let bc, bc2: Blockchain<string>;
    let block: Block;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
        block = new Block(Date.now(), bc.last().hash, 'baz', 0, data);
    });

    it('should start with genesis block', () => {
        expect(bc.last()).toEqual(Block.genesis());
    });

    it('should add a new block', () => {

        bc.addBlock(block);
        expect(bc.last().data).toEqual(block.data);
    });

});