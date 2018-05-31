import 'reflect-metadata';
import 'es6-shim';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { Container } from 'typedi';
import { createKoaServer, useContainer } from 'routing-controllers';
import { BlockchainController, TransactionController } from './controllers';
import { Server } from './server';

const PORT: number = process.env.PORT ? parseInt( process.env.PORT, 10) : 3001;
const P2P_PORT: number = process.env.P2P_PORT ? parseInt(process.env.P2P_PORT, 10) : 5001;
const peers: string[] = process.env.PEERS ? process.env.PEERS.split(',') : [];
const p2p: Server = new Server();

useContainer(Container);

const app: Koa = createKoaServer( {
    routePrefix: 'api',
    controllers: [
        BlockchainController,
        TransactionController
    ]
});

app.use(bodyParser());

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`)
    p2p.listen(P2P_PORT, peers);
});