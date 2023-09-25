/**
 * RelativeArray is a wrapper around an array that allows for relative (negative) indexing.
 */

export default class RelativeArray<T> {
  private readonly negative: T[] = [];
  private readonly positive: T[] = [];

  public add(index: number, value: T): void {
    if(index < 0) {
      this.negative[-index-1] = value;
    } else {
      this.positive[index] = value;
    }
  }

  public get(index: number): T {
    if(index < 0) {
      return this.negative[-index-1];
    } else {
      return this.positive[index];
    }
  }

  public getOrAdd(index: number, value: T): T {
    const existing = this.get(index);
    if(existing !== undefined) {
      return existing;
    }
    this.add(index, value);
    return value;
  }

  public remove(index: number): void {
    if(index < 0) {
      delete this.negative[-index-1];
    } else {
      delete this.positive[index];
    }
  }

  public removeValue(value: T): void {
    const index = this.indexOf(value);
    if(index !== -1) {
      this.remove(index);
    }
  }

  public indexOf(value: T): number {
    const index = this.positive.indexOf(value);
    if(index !== -1) {
      return index;
    }
    return -this.negative.indexOf(value);
  }

  public get length(): number {
    return this.negative.length + this.positive.length;
  }

  *[Symbol.iterator]() {
    for(let i = 0; i < this.negative.length; i++) {
      yield this.negative[i];
    }
    for(let i = 0; i < this.positive.length; i++) {
      yield this.positive[i];
    }
  }
}