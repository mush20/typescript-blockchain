import * as Websocket from 'ws';
import { Service, Inject } from 'typedi';
import { BlockchainService } from '@app/services/blockchain.service';

@Service()
export class P2pService {

    sockets: Websocket[] = [];

    @Inject()
    private _blockChainService: BlockchainService;

    constructor() {
    }

    // Connects the socket and sends a message with the blockchain
    connect(socket: Websocket): void {
        this.sockets.push(socket);
        console.log('Socket connected');

        this.receive(socket);

        this.send(socket);

        socket.send(JSON.stringify(this._blockChainService.getChain()));

    }

    connectTo(peers: string[]): void {
        peers.forEach(peer => {
            const socket: Websocket = new Websocket(peer);
            socket.on('open', () => this.connect(socket));
        });
    }

    send(socket: Websocket) {
        socket.send(JSON.stringify(this._blockChainService.getChain()));
    }

    receive(socket: Websocket): void {
        socket.on('message', (message: string) => {
            const data = JSON.parse(message);
            this._blockChainService.replace(data);
        });
    }

    sync(): void {
        this.sockets.forEach((socket: Websocket) => this.send(socket));
    }

}