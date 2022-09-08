import Event from "./Event";

export default class EventPromise<T> extends Event<T> {
    private _promise: Promise<T>;
    private _resolve: (value: T) => void;

    private started: boolean = false;

    public constructor() {
      super();
      this.restart();
    }

    public restart() {
      if(this.started) {
        return;
      }
      this._promise = new Promise((resolve) => {
        this._resolve = resolve;
      });
      this.started = true;
    }

    public trigger(value: T) {
      this._resolve(value);
      super.trigger(value);
      this.started = false;
    }

    public get promise() {
      return this._promise;
    }
}