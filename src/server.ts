import * as Websocket from 'ws';
import { Container } from 'typedi';
import { P2pService } from '@app/services';

const P2P_PORT: number = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT, 10) : 5001;
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];

export class Server {

    private _serverService: P2pService = Container.get(P2pService);

    constructor() {
    }

    listen(): void {
        const server: Websocket.Server = new Websocket.Server({port: P2P_PORT});
        server.on('connection', socket => this._serverService.connect(socket));

        this._serverService.connectTo(peers);

        console.log(`P2P listening on port ${P2P_PORT}`);
    }
}