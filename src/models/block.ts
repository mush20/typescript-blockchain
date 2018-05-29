export class Block<T = any> {

    constructor(public timestamp: number,
                public previousHash: string,
                public hash: string,
                public nonce: number,
                public data: T) {

    }

    toString() {
        return `Block -
            Timestamp       : ${this.timestamp}
            Previous Hash   : ${this.previousHash.substring(0, 10)}
            Hash            : ${this.hash.substring(0, 10)}
            Nonce           : ${this.nonce}
            Data            : ${this.data}
        `;
    }

    static genesis(): Block {
        return new this(0, '-----', 'f1r57-h45h', 0, []);
    }
}