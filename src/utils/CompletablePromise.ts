export default class CompletablePromise<T> {
  public promise: Promise<T>;
  private resolve: (value: T) => void;
  private reject: (reason: any) => void;

  public constructor() {
    this.complete = this.complete.bind(this);
    this.reset();
  }

  public reset() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  public complete(value: T) {
    this.resolve(value);
  }


  public fail(reason: any) {
    this.reject(reason);
  }
}