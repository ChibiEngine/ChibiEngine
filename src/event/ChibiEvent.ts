/**
 * TODO: switch to eventemitter3 ?
 */
import CompletablePromise from "../utils/CompletablePromise";
import ExtensibleFunction from "../utils/ExtensibleFunction";

export interface ChibiEvent<A extends Array<any>> {
  (callback: (...args: A) => void): ChibiEventListener<ChibiEvent<A>>;
}

export class ChibiEvent<A extends Array<any>> extends ExtensibleFunction {
  private bindToComponent = false;

  public readonly dontProxyFunction: boolean = true;

  // readonly
  public listeners: ChibiEventListener<ChibiEvent<A>>[] = [];

  public lastValue: A = undefined;

  private _onAddListener: ChibiEvent<[ChibiEventListener<ChibiEvent<A>>]>;
  private _onRemoveListener: ChibiEvent<[ChibiEventListener<ChibiEvent<A>>]>;

  private readonly _promise: CompletablePromise<A> = new CompletablePromise();

  constructor() {
    super((callback: (...args: any[]) => void) => {
      return this.subscribe(callback);
    })
  }

  public get onAddListener() {
    if (!this._onAddListener) {
      this._onAddListener = new ChibiEvent<[ChibiEventListener<ChibiEvent<A>>]>();
    }
    return this._onAddListener;
  }

  public get onRemoveListener() {
    if (!this._onRemoveListener) {
      this._onRemoveListener = new ChibiEvent<[ChibiEventListener<ChibiEvent<A>>]>();
    }
    return this._onRemoveListener;
  }

  public promise(): Promise<A> {
    if(this.lastValue) {
      return Promise.resolve(this.lastValue);
    }
    return this.nextValuePromise();
  }

  public nextValuePromise(): Promise<A> {
    return this._promise.promise;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.
   */
  public subscribe(callback: ((...args: A) => void) | ChibiEventListener<ChibiEvent<A>>, instantTrigger: boolean = true): ChibiEventListener<ChibiEvent<A>> {
    let listener: ChibiEventListener<ChibiEvent<A>>;
    if(typeof callback !== "function") {
      this.listeners.push(callback);
      listener = callback;
      callback = callback.callback;
    } else {
      listener = new ChibiEventListener<ChibiEvent<A>>(this, callback);
      this.listeners.push(listener);
    }
    if(this.lastValue && instantTrigger) {
      callback(...this.lastValue);
    }
    this._onAddListener?.trigger(listener);
    return listener;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.   */
  public subscribeOnce(callback: ((...args: A) => void) | ChibiEventListener<ChibiEvent<A>>, instantTrigger: boolean = true): ChibiEventListener<ChibiEvent<A>> {
    if(typeof callback !== "function") {
      callback = callback.callback;
    }
    const once = (...value: A) => {
      this.unsubscribe(listener);
      callback(...value);
    };
    const listener = new ChibiEventListener<ChibiEvent<A>>(this, once);
    this.listeners.push(listener);
    if(this.lastValue && instantTrigger) {
      callback(...this.lastValue);
    }
    this._onAddListener?.trigger(listener);
    return listener;
  }

  public unsubscribe(listener: ((...args: A) => void) | ChibiEventListener<ChibiEvent<A>>) {
    let index = this.listeners.findIndex(l => l === listener || l.callback === listener);

    if(index === -1) {
      return false;
    }

    listener = this.listeners[index];
    this.listeners.splice(index, 1);

    this._onRemoveListener?.trigger(listener);
    return true;
  }

  public trigger(...args: A) {
    const listeners = this.listeners.slice();
    for (const listener of listeners) {
      listener.callback(...args);
    }
    this._promise.complete(args);
    this._promise.reset();
    this.lastValue = args;
  }

  public reset() {
    this.lastValue = undefined;
    this._promise.reset();
  }
}

type EventArgs<E extends ChibiEvent<any>> = E extends ChibiEvent<infer A> ? A : never;

export class ChibiEventListener<E extends ChibiEvent<any>> {
  constructor(private readonly event: E, public readonly callback: (...args: EventArgs<E>) => void) {
  }

  /**
   * Triggers the callback with the last value.
   */
  public callWithLastEventValue() {
    this.callback(...this.event.lastValue);
  }

  /**
   * Triggers the callback with the given value.
   * @param value
   */
  public call(value: EventArgs<E>) {
    this.callback(...value);
  }

  public remove() {
    this.event.unsubscribe(this);
  }
}
