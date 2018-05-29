import { BlockchainService } from './blockchain.service';
import { Block } from '../models';
import * as SHA256 from 'crypto-js/sha256';
import { useContainer } from 'routing-controllers';
import { Container } from 'typedi';

useContainer(Container);

describe('Model: Block', () => {

    let bcs1: BlockchainService<string>;
    let bcs2: BlockchainService<string>;
    let mine: Block;

    beforeEach(() => {
        bcs1 = new BlockchainService();
        bcs2 = new BlockchainService();
        mine = bcs2.mine('foo');
    });

    it('should start with genesis block', () => {
        expect(bcs1.getChain()[0]).toEqual(Block.genesis());
    });

    it('should replace the chain with a valid chain', () => {

        bcs1.replace(bcs2.getChain());

        expect(bcs1.getChain()).toEqual(bcs2.getChain());

    });

    it('should not replace the chain for a shorter chain', () => {

        bcs2.replace(bcs1.getChain());
        expect(bcs2.getChain()).not.toEqual(bcs1.getChain());

    });

    it('should not replace the chain for an invalid chain', () => {

        bcs2.getChain()[1].data = 'not foo';
        bcs1.replace(bcs2.getChain());

        expect(bcs1.getChain()).not.toEqual(bcs2.getChain());

    });

    it('should mine a block', () => {
        expect(mine.hash).not.toBeNull();
        expect(mine.data).toEqual('foo');
        expect(mine.previousHash).toEqual(bcs1.getChain()[0].hash);
        expect(mine.timestamp).not.toBeNull();
    });

    it('should generate a hash from a block', () => {

        const hash = SHA256(`${mine.timestamp}${mine.previousHash}${mine.data}${mine.nonce}`).toString();
        expect(bcs1.blockHash(mine)).toEqual(hash);
    });

});