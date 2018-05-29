export class Block<T = any> {

    constructor(public timestamp: number,
                public previousHash: string,
                public hash: string,
                public nonce: number,
                public difficulty: number,
                public data: T) {

    }

    toString() {
        return `Block -
            Timestamp       : ${this.timestamp}
            Previous Hash   : ${this.previousHash.substring(0, 10)}
            Hash            : ${this.hash.substring(0, 10)}
            Nonce           : ${this.nonce}
            Difficulty      : ${this.difficulty}
            Data            : ${this.data}
        `;
    }

    static genesis(difficult: number): Block {
        return new Block(0, '-----', 'f1r57-h45h', 0, difficult, []);
    }
}