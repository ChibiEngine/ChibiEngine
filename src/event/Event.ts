class EventImpl<T> extends Function {
  public readonly dontProxyFunction: boolean = true;

  private listeners: EventListener<T>[] = [];

  private lastValue: T = undefined;

  constructor() {
    super();
    return new Proxy(this, {
      apply (target, thisArg, args) {
        const callback = args[0];
        // An empty call is treated as a read
        if (!callback || typeof callback !== "function") {
          throw new Error("Event must be called with a callback parameter.");
        }

        target.subscribe(callback);
      }
    })
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true and the event has already been triggered, the callback will be called immediately with the last value.
   */
  public subscribe(callback: (value: T) => void, instantTrigger: boolean = false): EventListener<T> {
    const listener = new EventListener(this, callback);
    this.listeners.push(listener);
    if(instantTrigger && this.lastValue !== undefined) {
      callback(this.lastValue);
    }
    return listener;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true and the event has already been triggered, the callback will be called immediately with the last value.
   */
  public subscribeOnce(callback: (value: T) => void, instantTrigger: boolean = false) {
    const once = (value: T) => {
      this.unsubscribe(listener);
      callback(value);
    };
    const listener = new EventListener<T>(this, once);
    this.listeners.push(listener);
    if(instantTrigger && this.lastValue !== undefined) {
      callback(this.lastValue);
    }
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
    this.lastValue = value;
  }

  public forget() {
    this.lastValue = undefined;
  }
}

declare type Event<T> = EventImpl<T> & ((callback: (val: T) => void) => EventListener<T>);

const Event: new <T>() => Event<T> = EventImpl as any;
export default Event;

export class EventListener<T> {
  constructor(private readonly event: EventImpl<T>, public readonly callback: (value: any) => void) {
  }

  public unsubscribe() {
    this.event.unsubscribe(this);
  }
}