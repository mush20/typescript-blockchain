import * as Websocket from 'ws';
import { Service, Inject } from 'typedi';
import { BlockchainService } from '@app/services/blockchain.service';
import { MessageTypes } from '@app/utils';
import { Transaction } from '@app/models';
import { TransactionPoolService } from '@app/services/transaction-pool.service';
import { MessageBlockchain } from '@app/models/messages/message-blockchain';
import { MessageTransaction } from '@app/models/messages/message-transaction';
import { Message } from '@app/models/messages/message';

@Service()
export class P2pService {

    sockets: Websocket[] = [];

    @Inject()
    private _blockChainService: BlockchainService;

    @Inject()
    private _transactionPoolService: TransactionPoolService;

    constructor() {
    }

    // Connects the socket and sends a message with the blockchain
    connect(socket: Websocket): void {
        this.sockets.push(socket);
        this.receive(socket);
        this.sendBlockchain(socket);
        socket.send(JSON.stringify(this._blockChainService.getChain()));
    }

    connectTo(peers: string[]): void {
        peers.forEach(peer => {
            const socket: Websocket = new Websocket(peer);
            socket.on('open', () => this.connect(socket));
        });
    }

    sendBlockchain(socket: Websocket) {
        const message: MessageBlockchain = new MessageBlockchain(this._blockChainService.getChain());
        socket.send(JSON.stringify(message));
    }

    sendTransaction(socket: Websocket, transaction: Transaction) {
        const message: MessageTransaction = new MessageTransaction(transaction);
        socket.send(JSON.stringify(message));
    }

    receive(socket: Websocket): void {
        socket.on('message', (message: string) => {

            const parsed: Message = JSON.parse(message);

            switch (parsed.type) {
                case MessageTypes.BLOCK_CHAIN:
                    this._blockChainService.replaceChain(parsed.data);
                    break;
                case MessageTypes.TRANSACTION:
                    this._transactionPoolService.addOrUpdateTransaction(parsed.data);

            }

        });
    }

    syncBlockChain(): void {
        this.sockets.forEach((socket: Websocket) => this.sendBlockchain(socket));
    }

    syncTransaction(transaction: Transaction): void {
        this.sockets.forEach((socket: Websocket) => this.sendTransaction(socket, transaction));
    }

}