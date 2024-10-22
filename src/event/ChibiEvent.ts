/**
 * TODO: switch to eventemitter3
 */
import CompletablePromise from "../utils/CompletablePromise";

class ChibiEventImpl<T> extends Function {
  public readonly dontProxyFunction: boolean = true;

  private listeners: EventListener<T>[] = [];

  lastValue: T = undefined;

  public readonly onAddListener: ChibiEvent<EventListener<T>>;

  // TODO : CompletablePromise<T> breaks typing
  private readonly promise: CompletablePromise<any> = new CompletablePromise();

  constructor(onAddListener: boolean = true) {
    super();
    if(onAddListener) {
      this.onAddListener = new ChibiEvent(false);
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

  public asPromise(): Promise<T> {
    return this.promise.promise;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.
   */
  public subscribe(callback: (value: T) => void, instantTrigger: boolean = true): EventListener<T> {
    const listener = new EventListener(this, callback);
    this.listeners.push(listener);
    if(this.lastValue && instantTrigger) {
      callback(this.lastValue);
    }
    this.onAddListener?.trigger(listener);
    return listener;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value if present.   */
  public subscribeOnce(callback: (value: T) => void, instantTrigger: boolean = true): EventListener<T> {
    const once = (value: T) => {
      this.unsubscribe(listener);
      callback(value);
    };
    const listener = new EventListener<T>(this, once);
    this.listeners.push(listener);
    if(this.lastValue && instantTrigger) {
      callback(this.lastValue);
    }
    this.onAddListener?.trigger(listener);
    return listener;
  }

  public unsubscribe(listener: EventListener<T>) {
    const index = this.listeners.indexOf(listener);
    if (index === -1) return false;
    this.listeners.splice(index, 1);
    return true;
  }

  public trigger(value: T) {
    const listeners = this.listeners.slice();
    for (const listener of listeners) {
      listener.callback(value);
    }
    this.promise.complete(value);
    this.lastValue = value;
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
export declare type ChibiEvent<T> = ChibiEventImpl<T> & ((callback: (val: T) => void, instantTrigger?: boolean) => EventListener<T>);

export const ChibiEvent: new <T>(onAddListener?: boolean) => ChibiEvent<T> = ChibiEventImpl as any;

export class EventListener<T> {
  constructor(private readonly event: ChibiEventImpl<T>, public readonly callback: (value: any) => void) {
  }

  /**
   * Triggers the callback with the last value.
   */
  public triggerNow() {
    this.callback(this.event.lastValue);
  }

  /**
   * Triggers the callback with the given value.
   * @param value
   */
  public triggerNowWith(value: T) {
    this.callback(value);
  }

  public unsubscribe() {
    this.event.unsubscribe(this);
  }
}