/**
 * TODO: switch to eventemitter3 ?
 */
import CompletablePromise from "../utils/CompletablePromise";

class ChibiEventImpl<A extends Array<any>> extends Function {
  public static readonly Multi: typeof ChibiMultiEvent = ChibiEventImpl as any;

  public readonly dontProxyFunction: boolean = true;

  // readonly
  public listeners: EventListener<ChibiEventImpl<A>>[] = [];

  public lastValue: A = undefined;

  private _onAddListener: ChibiEvent<EventListener<ChibiEventImpl<A>>>;
  private _onRemoveListener: ChibiEvent<EventListener<ChibiEventImpl<A>>>;

  private readonly promise: CompletablePromise<A> = new CompletablePromise();

  constructor() {
    super();
    return new Proxy(this, {
      apply (target, thisArg, args) {
        const callback = args[0];
        const instantTrigger = args[1];
        // An empty call is treated as a read
        if (!callback || typeof callback !== "function") {
          throw new Error("Event must be called with a callback parameter.");
        }

        return target.subscribe(callback, instantTrigger);
      }
    });
  }

  public get onAddListener() {
    if (!this._onAddListener) {
      this._onAddListener = new ChibiEvent();
    }
    return this._onAddListener;
  }

  public get onRemoveListener() {
    if (!this._onRemoveListener) {
      this._onRemoveListener = new ChibiEvent();
    }
    return this._onRemoveListener;
  }

  public asPromise(): Promise<A> {
    return this.promise.promise;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.
   */
  public subscribe(callback: ((...args: A) => void) | EventListener<ChibiEventImpl<A>>, instantTrigger: boolean = true): EventListener<ChibiEventImpl<A>> {
    let listener: EventListener<ChibiEventImpl<A>>;
    if(typeof callback !== "function") {
      this.listeners.push(callback);
      listener = callback;
      callback = callback.callback;
    } else {
      listener = new EventListener<ChibiEventImpl<A>>(this, callback);
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
  public subscribeOnce(callback: ((...args: A) => void) | EventListener<ChibiEventImpl<A>>, instantTrigger: boolean = true): EventListener<ChibiEventImpl<A>> {
    if(typeof callback !== "function") {
      callback = callback.callback;
    }
    const once = (...value: A) => {
      this.unsubscribe(listener);
      callback(...value);
    };
    const listener = new EventListener<ChibiEventImpl<A>>(this, once);
    this.listeners.push(listener);
    if(this.lastValue && instantTrigger) {
      callback(...this.lastValue);
    }
    this._onAddListener?.trigger(listener);
    return listener;
  }

  public unsubscribe(listener: ((...args: A) => void) | EventListener<ChibiEventImpl<A>>) {
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
    this.promise.complete(args);
    this.lastValue = args;
  }

  public reset() {
    this.lastValue = undefined;
    this.promise.reset();
  }
}

/**
 * @param callback
 * @param instantTrigger If true and the event has already been triggered, the callback will be called immediately with the last value.
 */
export declare type ChibiEvent<A> = ChibiEventImpl<[A]> & ((callback: (...args: [A]) => void, instantTrigger?: boolean) => EventListener<ChibiEventImpl<[A]>>);

export const ChibiEvent: (new <A>(onAddListener?: boolean) => ChibiEvent<A>) & {
  Multi: new <B extends Array<any>>(onAddListener?: boolean) => ChibiMultiEvent<B>;
} = ChibiEventImpl as any;

/**
 * @param callback
 * @param instantTrigger If true and the event has already been triggered, the callback will be called immediately with the last value.
 */
export declare type ChibiMultiEvent<A extends Array<any>> = ChibiEventImpl<A> & ((callback: (...args: A) => void, instantTrigger?: boolean) => EventListener<ChibiEventImpl<A>>);

export const ChibiMultiEvent: (new <A extends Array<any>>(onAddListener?: boolean) => ChibiMultiEvent<A>) = ChibiEventImpl as any;

type EventArgs<E extends ChibiEventImpl<any>> = E extends ChibiEventImpl<infer A> ? A : never;

export class EventListener<E extends ChibiEventImpl<any>> {
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
