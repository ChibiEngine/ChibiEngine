export default class Event<T> {
  private listeners: ((value: T) => void)[] = [];

  public subscribe(listener: (value: T) => void) {
    this.listeners.push(listener);
  }

  public trigger(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }

  public join(): Promise<T> {
    return new Promise((resolve) => {
      this.subscribe(resolve);
    });
  }
}
