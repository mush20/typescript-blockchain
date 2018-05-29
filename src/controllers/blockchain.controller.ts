import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject, Container } from 'typedi';
import { BlockchainService } from '@app/services/blockchain.service';

@JsonController('/v1/blockchain')
export class BlockchainController {

    @Inject()
    private _blockchainService: BlockchainService;

    @Get('/')
    getAll() {
        console.log(Container.get(BlockchainService).getChain());
        return this._blockchainService.getChain();
    }

    @Post('/mine')
    mine(@Body() body) {
        this._blockchainService.mine(body.data);
        return this.getAll();
    }
}