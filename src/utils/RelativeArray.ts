export default class RelativeArray<T> {
  private readonly indexes: number[] = [];
  private readonly values: Map<number, T> = new Map();


  public add(index: number, value: T): void {
    this.indexes.push(index);
    this.values.set(index, value);

    this.indexes.sort((a, b) => a - b);
  }

  public get(index: number): T {
    return this.values.get(index);
  }

  public getOrAdd(index: number, value: T): T {
    const existing = this.get(index);
    if (existing !== undefined) {
      return existing;
    }
    this.add(index, value);
    return value;
  }

  public remove(index: number): void {
    const indexIndex = this.indexes.indexOf(index);
    if(indexIndex === -1) return;

    this.indexes.splice(indexIndex, 1);
    this.values.delete(index);
  }

  public removeValue(value: T): void {
    const index = this.indexOf(value);
    if (index !== -1) {
      this.remove(index);
    }
  }

  public indexOf(value: T): number {
    for (const index of this.indexes) {
      if (this.values.get(index) === value) {
        return index;
      }
    }
    return -1;
  }

  public get length(): number {
    return this.indexes.length;
  }

  * [Symbol.iterator]() {
    for(const index of this.indexes) {
      yield this.values.get(index);
    }
  }
}