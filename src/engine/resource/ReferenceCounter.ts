export default class ReferenceCounter {
    private _count: number = 0;

    public increment() {
        this._count++;
    }

    public decrement() {
        this._count--;
    }

    public get isZero() {
        return this._count === 0;
    }
}