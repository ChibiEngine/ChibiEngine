class EventImpl<T> extends Function {
  public readonly dontProxyFunction: boolean = true;

  private listeners: EventListener<T>[] = [];

  lastValue: T = undefined;

  public readonly onAddListener: Event<EventListener<T>>;

  constructor(onAddListener: boolean = true) {
    super();
    if(onAddListener) {
      this.onAddListener = new Event(false);
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
    })
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value (or undefined).
   */
  public subscribe(callback: (value: T) => void, instantTrigger: boolean = false): EventListener<T> {
    const listener = new EventListener(this, callback);
    this.listeners.push(listener);
    if(instantTrigger) {
      callback(this.lastValue);
    }
    this.onAddListener && this.onAddListener.trigger(listener);
    return listener;
  }

  /**
   *
   * @param callback
   * @param instantTrigger If true the callback will be called immediately with the last known value (or undefined).   */
  public subscribeOnce(callback: (value: T) => void, instantTrigger: boolean = false): EventListener<T> {
    const once = (value: T) => {
      this.unsubscribe(listener);
      callback(value);
    };
    const listener = new EventListener<T>(this, once);
    this.listeners.push(listener);
    if(instantTrigger) {
      callback(this.lastValue);
    }
    this.onAddListener && this.onAddListener.trigger(listener);
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

/**
 * @param callback
 * @param instantTrigger If true and the event has already been triggered, the callback will be called immediately with the last value.
 */
declare type Event<T> = EventImpl<T> & ((callback: (val: T) => void, instantTrigger?: boolean) => EventListener<T>);

const Event: new <T>(onAddListener?: boolean) => Event<T> = EventImpl as any;
export default Event;

export class EventListener<T> {
  constructor(private readonly event: EventImpl<T>, public readonly callback: (value: any) => void) {
  }

  /**
   * Triggers the callback with the last value.
   */
  public triggerNow() {
    this.callback(this.event.lastValue);
  }

  /**
   * Triggers the callback if the event has already been triggered.
   */
  public triggerNowIfValueExists() {
    if(this.event.lastValue !== undefined) {
      this.callback(this.event.lastValue);
    }
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