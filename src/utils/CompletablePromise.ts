export default class CompletablePromise<T> implements Promise<T> {
  private promise: Promise<T>;
  private resolve: (value: T) => void;
  private reject: (reason: any) => void;

  public constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public complete(value: T) {
    this.resolve(value);
  }

  public reset() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public fail(reason: any) {
    this.reject(reason);
  }

  public get then() {
    return this.promise.then.bind(this.promise);
  }

  public get catch() {
    return this.promise.catch.bind(this.promise);
  }

  public get finally() {
    return this.promise.finally.bind(this.promise);
  }

  public [Symbol.toStringTag]: "Promise";
}