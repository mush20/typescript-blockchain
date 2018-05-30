export class Block<T = any> {

    constructor(readonly timestamp: number,
                readonly previousHash: string,
                readonly hash: string,
                readonly nonce: number,
                readonly difficulty: number,
                readonly data: T) {

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