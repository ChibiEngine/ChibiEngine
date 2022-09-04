export default class Event<T> {
  private listeners: (<K extends T>(value: K) => void)[] = [];

  public get promise(): Promise<T> {
    return new Promise((resolve) => {
      const that = this;

      function listener(value: T) {
        resolve(value);
        //@ts-ignore
        that.unsubscribe(this);
      }

      this.subscribe(listener);
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
