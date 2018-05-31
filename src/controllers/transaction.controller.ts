import { JsonController, Param, Body, Get, Post, Put, Delete, BadRequestError } from 'routing-controllers';
import { Inject } from 'typedi';
import { TransactionPoolService } from '@app/services/transaction-pool.service';
import { Transaction, Wallet } from '@app/models';
import { P2pService } from '@app/services/p2p.service';

const wallet: Wallet = new Wallet(500);

@JsonController('/v1/transactions')
export class TransactionController {

    @Inject()
    private _transactionPool: TransactionPoolService;

    @Inject()
    private _transactionService: TransactionPoolService;

    @Inject()
    private _serverService: P2pService;

    @Get('/')
    getAll() {
        return this._transactionPool.transactions;
    }

    @Post('/')
    transact(@Body() body) {
        const {address, amount} = body;

        const result = this._transactionPool.createTransaction(wallet, address, amount);

        if (result.transaction) {
            this._serverService.syncTransaction(result.transaction); // Sync all sockets
            return this.getAll();
        } else {
            throw new BadRequestError(result.message);
        }
    }

}