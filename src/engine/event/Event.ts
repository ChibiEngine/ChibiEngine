export default class Event<T> {
  private listeners: ((value: T) => void)[] = [];

  public subscribe(listener: (value: T) => void) {
    this.listeners.push(listener);
  }

  public unsubscribe(listener: (value: T) => void) {
    const index = this.listeners.indexOf(listener);
    if (index === -1) return false;
    this.listeners.splice(index, 1)[0];
    return true;
  }

  public trigger(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }

  public promise(): Promise<T> {
    return new Promise((resolve) => {
      const callback = (value: T) => {
          resolve(value);
          this.unsubscribe(callback);
      }
      this.subscribe(callback);
    });
  }
}
