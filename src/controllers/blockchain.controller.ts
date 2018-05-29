import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';
import { BlockchainService } from '@app/services/blockchain.service';
import { P2pService } from '@app/services/p2p.service';

@JsonController('/v1/blockchain')
export class BlockchainController {

    @Inject()
    private _blockchainService: BlockchainService;

    @Inject()
    private _serverService: P2pService;

    @Get('/')
    getAll() {
        return this._blockchainService.getChain();
    }

    @Post('/mine')
    mine(@Body() body) {
        this._blockchainService.mine(body.data); // Mines a new block
        this._serverService.sync(); // Sync all sockets
        return this.getAll(); // returns the whole chain
    }
}