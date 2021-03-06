import { BlockchainService } from './blockchain.service';
import { Block } from '../models';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { ConfigService } from '@app/services/config.service';

useContainer(Container);

class ConfigServiceMock {

    constructor(public mineRate: number = 3000) {
    }

    get DIFFICULTY(): number {
        return 2;
    }

    get MINE_RATE(): number {
        return this.mineRate;
    }
}

describe('Service: Blockchain', () => {

    let bcs1: BlockchainService<string>;
    let bcs2: BlockchainService<string>;
    let mine: Block;

    beforeEach(() => {
        Container.reset();
        bcs1 = new BlockchainService();
        bcs2 = new BlockchainService();
        mine = bcs2.mineBlock('foo');
    });

    it('should start with genesis block', () => {
        expect(bcs1.getChain()[0].hash).toEqual('f1r57-h45h');
    });

    it('should replaceChain the chain with a valid chain', () => {

        bcs1.replaceChain(bcs2.getChain());

        expect(bcs1.getChain()).toEqual(bcs2.getChain());

    });

    it('should not replaceChain the chain for a shorter chain', () => {

        bcs2.replaceChain(bcs1.getChain());
        expect(bcs2.getChain()).not.toEqual(bcs1.getChain());

    });

    it('should not replaceChain the chain for an invalid chain', () => {

        bcs2.getChain()[1].data = 'not foo';
        bcs1.replaceChain(bcs2.getChain());

        expect(bcs1.getChain()).not.toEqual(bcs2.getChain());

    });

    it('should mineBlock a block', () => {
        expect(mine.hash).not.toBeNull();
        expect(mine.data).toEqual('foo');
        expect(mine.previousHash).toEqual(bcs1.getChain()[0].hash);
        expect(mine.timestamp).not.toBeNull();
    });

    describe('Adjustable difficulty', () => {

        beforeEach(()=> {
            Container.reset();
        })

        it('should lower the difficult for slow blocks', () => {

            Container.set(ConfigService, new ConfigServiceMock(1));
            let bcs3: BlockchainService<string> = Container.get(BlockchainService);
            const expected = bcs3.mineBlock('foo');
            expect(expected.difficulty).toEqual(1);

        });

        it('should raise the difficult for fast blocks', () => {

            Container.set(ConfigService, new ConfigServiceMock(360000000));
            let bcs3: BlockchainService<string> = Container.get(BlockchainService);

            bcs3.mineBlock('foo');
            bcs3.mineBlock('foo');
            bcs3.mineBlock('foo');
            const expected = bcs3.mineBlock('foo');

            expect(expected.difficulty).toEqual(4);

        });
    });

});