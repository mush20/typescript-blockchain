import { Block } from './block';
import { Blockchain } from './blockchain';

describe('Model: Block', () => {

    let bc, bc2: Blockchain<string>;

    beforeEach(() => {
        bc = new Blockchain();
        bc2 = new Blockchain();
    });

    it('should start with genesis block', () => {
        expect(bc.chain[0]).toEqual(Block.genesis());
    });

    it('should add a new block', () => {

        const data: string = 'foo';
        bc.addBlock(data);

        expect(bc.last().data).toEqual(data);
    });

    it('should return true for a valid chain', () => {

        bc.addBlock('foo')
        const data: string = 'foo';
        bc.addBlock(data);

        expect(bc.isValid(bc2.chain)).toBe(true);
    });

    it('should return false for an invalid chain', () => {

        bc2.chain[0].data = 'bad data';

        expect(bc.isValid(bc2.chain)).toBe(false);

    });

    it('should return false for an invalid chain 2', () => {

        bc2.addBlock('foo');
        bc2.chain[1].data = 'not foo';

        expect(bc.isValid(bc2.chain)).toBe(false);

    });

    it('should replace the chain with a valid chain', () => {

        bc2.addBlock('goo');
        bc.replace(bc2.chain);

        expect(bc.chain).toEqual(bc2.chain);

    });

    it('should not replace the chain for a shorter chain', () => {

        bc.addBlock('goo');
        bc.replace(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);

    });

    it('should not replace the chain for an invalid chain', () => {

        bc2.addBlock('foo');
        bc2.chain[1].data = 'not foo';
        bc.replace(bc2.chain);

        expect(bc.chain).not.toEqual(bc2.chain);

    });

});