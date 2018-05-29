import * as Websocket from 'ws';
import { Container } from 'typedi';
import { P2pService } from '@app/services';

export class Server {

    private _serverService: P2pService = Container.get(P2pService);

    constructor() {
    }

    listen(port: number, peers: string[]): void {
        const server: Websocket.Server = new Websocket.Server({port: port});
        server.on('connection', socket => this._serverService.connect(socket));

        this._serverService.connectTo(peers);

        console.log(`P2P listening on ${port}`);
    }
}