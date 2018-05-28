import * as SHA256 from 'crypto-js/sha256';

export class Block<T = any> {

    constructor(public timestamp: number, public previousHash: string, public hash: string, public data: T) {

    }

    toString() {
        return `Block -
            Timestamp       : ${this.timestamp}
            Previous Hash   : ${this.previousHash.substring(0, 10)}
            Hash            : ${this.hash.substring(0, 10)}
            Data            : ${this.data}
        `;
    }

    static genesis(): Block {
        return new this(0, '-----', 'f1r57-h45h', []);
    }

    static mine<T = any>(previous: Block, data: T): Block {
        const timestamp: number = Date.now();
        const previousHash: string = previous.hash;
        const hash = Block.hash<T>(timestamp, previousHash, data);

        return new this(timestamp, previousHash, hash, data);
    }

    static hash<T = any>(timestamp: number, previousHash: string, data: T): string {
        return SHA256(`${timestamp}${previousHash}${data}`).toString();
    }
}