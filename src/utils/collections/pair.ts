export class Pair<T, S> {


    constructor(readonly left: T, readonly right: S) {

    }

    static of<T, S>(left: T, right: S): Pair<T, S> {
        return new this(left, right);
    }
}