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

    @Post('/mineBlock')
    mine(@Body() body) {
        this._blockchainService.mineBlock(body.data); // Mines a new block
        this._serverService.syncBlockChain(); // Sync all sockets
        return this.getAll(); // returns the whole chain
    }
}