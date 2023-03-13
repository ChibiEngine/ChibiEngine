export default class Event<T> {
  private listeners: EventListener<T>[] = [];

  public subscribe(callback: (value: T) => void): EventListener<T> {
    const listener = new EventListener(this, callback);
    this.listeners.push(listener);
    return listener;
  }

  public subscribeOnce(callback: (value: T) => void) {
    const once = (value: T) => {
      this.unsubscribe(listener);
      callback(value);
    };
    const listener = new EventListener<T>(this, once);
    this.listeners.push(listener);
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
  }
}

export class EventListener<T> {
  constructor(private readonly event: Event<T>, public readonly callback: (value: any) => void) {
  }

  public unsubscribe() {
    this.event.unsubscribe(this);
  }
}