export default class Event<T> {
  private listeners: (<K extends T>(value: K) => void)[] = [];
  public readonly promise: Promise<T>;

  public constructor() {
    this.promise = new Promise((resolve) => {
      this.subscribe(resolve);
    });
  }


  public subscribe(listener: (value: T) => void) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: (value: T) => void) {
    const index = this.listeners.indexOf(listener);
    if (index === -1) return false;
    this.listeners.splice(index, 1);
    return true;
  }

  public trigger(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}
