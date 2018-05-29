import 'reflect-metadata';
import 'es6-shim';
import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import { Container } from 'typedi';
import { useKoaServer, useContainer } from 'routing-controllers';
import { BlockchainController } from './controllers';

useContainer(Container);

const PORT = process.env.PORT || 3000;
const app: Koa = new Koa();

useKoaServer(app, {
    routePrefix: 'api',
    controllers: [BlockchainController]
});

app.use(bodyParser());

app.listen(PORT, () => console.log(`app listening on ${PORT}`));
