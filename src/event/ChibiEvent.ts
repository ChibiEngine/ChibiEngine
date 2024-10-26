/**
 * TODO: switch to eventemitter3 ?
 */
import CompletablePromise from "../utils/CompletablePromise";

type Args<A, M extends boolean> = M extends true ? (A extends Array<any> ? A : [A]) : [A];

class ChibiEventImpl<A, MULTI_ARGS extends boolean = false> extends Function {
  public static readonly Multi: typeof ChibiEventMultiImpl;

  public readonly dontProxyFunction: boolean = true;

  private listeners: EventListener<ChibiEventImpl<A, MULTI_ARGS>>[] = [];

  public lastValue: Args<A, MULTI_ARGS> = undefined;

  public readonly onAddListener: ChibiEvent<EventListener<ChibiEventImpl<A, MULTI_ARGS>>>;

  private readonly promise: CompletablePromise<Args<A, MULTI_ARGS>> = new CompletablePromise();

  constructor(onAddListener: boolean = true) {
    super();
    if(onAddListener) {
      this.onAddListener = new ChibiEvent<EventListener<ChibiEventImpl<A, MULTI_ARGS>>>(false);
    }
    return new Proxy(this, {
      apply (target, thisArg, args) {
        const callback = args[0];
        const instantTrigger = args[1] || false;
        // An empty call is treated as a read
        if (!callback || typeof callback !== "function") {
          throw new Error("Event must be called with a callback parameter.");
        }

        return target.subscribe(callback, instantTrigger);
      }
    });
  }

  public asPromise(): Promise<Args<A, MULTI_ARGS>> {
    return this.promise.promise;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.
   */
  public subscribe(callback: ((...args: Args<A, MULTI_ARGS>) => void) | EventListener<ChibiEventImpl<A, MULTI_ARGS>>, instantTrigger: boolean = true): EventListener<ChibiEventImpl<A, MULTI_ARGS>> {
    let listener: EventListener<ChibiEventImpl<A, MULTI_ARGS>>;
    if(typeof callback !== "function") {
      this.listeners.push(callback);
      listener = callback;
      callback = callback.callback;
    } else {
      listener = new EventListener<ChibiEventImpl<A, MULTI_ARGS>>(this, callback);
      this.listeners.push(listener);
    }
    if(this.lastValue && instantTrigger) {
      callback(...this.lastValue);
    }
    this.onAddListener?.trigger(listener);
    return listener;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.   */
  public subscribeOnce(callback: ((...args: Args<A, MULTI_ARGS>) => void) | EventListener<ChibiEventImpl<A, MULTI_ARGS>>, instantTrigger: boolean = true): EventListener<ChibiEventImpl<A, MULTI_ARGS>> {
    if(typeof callback !== "function") {
      callback = callback.callback;
    }
    const once = (...value: Args<A, MULTI_ARGS>) => {
      this.unsubscribe(listener);
      callback(...value);
    };
    const listener = new EventListener<ChibiEventImpl<A, MULTI_ARGS>>(this, once);
    this.listeners.push(listener);
    if(this.lastValue && instantTrigger) {
      callback(...this.lastValue);
    }
    this.onAddListener?.trigger(listener);
    return listener;
  }

  public unsubscribe(listener: ((...args: Args<A, MULTI_ARGS>) => void) | EventListener<ChibiEventImpl<A, MULTI_ARGS>>) {
    let sizeBefore = this.listeners.length;

    if (listener instanceof EventListener) {
      this.listeners = this.listeners.filter(l => l !== listener);
    } else {
      this.listeners = this.listeners.filter(l => l.callback !== listener);
    }

    return sizeBefore !== this.listeners.length;
  }

  public trigger(...args: Args<A, MULTI_ARGS>) {
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

class ChibiEventMultiImpl<A> extends ChibiEventImpl<A, true> {
}

Object.defineProperty(ChibiEventImpl, "Multi", {
  value: ChibiEventMultiImpl
});

/**
 * @param callback
 * @param instantTrigger If true and the event has already been triggered, the callback will be called immediately with the last value.
 */
export declare type ChibiEvent<A, MULTI_ARGS extends boolean = false> = ChibiEventImpl<A, MULTI_ARGS> & ((callback: (...args: Args<A, MULTI_ARGS>) => void, instantTrigger?: boolean) => EventListener<ChibiEvent<A, MULTI_ARGS>>);

export declare type ChibiEventMulti<A> = ChibiEvent<A, true>;

export const ChibiEvent: (new <A, MULTI_ARGS extends boolean = false>(onAddListener?: boolean) => ChibiEvent<A, MULTI_ARGS>) & {
  Multi: new <A>(onAddListener?: boolean) => ChibiEventMulti<A>;
} = ChibiEventImpl as any;

type EventArgs<E> = E extends ChibiEventImpl<infer A, infer B> ? Args<A, B> : never;

export class EventListener<E extends ChibiEventImpl<any, any>> {
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
