import 'reflect-metadata';
import 'es6-shim';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { Container } from 'typedi';
import { useKoaServer, useContainer } from 'routing-controllers';
import { BlockchainController } from './controllers';
import { Server } from './server';

useContainer(Container);

const PORT = process.env.PORT || 3001;
const app: Koa = new Koa();
const p2p: Server = new Server();

useKoaServer(app, {
    routePrefix: 'api',
    controllers: [BlockchainController]
});

app.use(bodyParser());

app.listen(PORT, () => console.log(`App listening on ${PORT}`));
p2p.listen();