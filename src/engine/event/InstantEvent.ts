import Event from "./Event";

/**
 * Event that is triggered immediately when subscribed if the event has been triggered in the past
 */
export default class InstantEvent<T> extends Event<T> {
  private loaded: boolean = false;
  private value: T;

  public trigger(value: T) {
    super.trigger(value);
    this.loaded = true;
    this.value = value;
  }

  public subscribeOnce(callback: (value: T) => void) {
    const listener = super.subscribeOnce(callback);
    if(this.loaded) {
      listener.callback(this.value);
    }
    return listener;
  }

  public subscribe(callback: (value: T) => void) {
    const listener = super.subscribe(callback);
    if(this.loaded) {
      listener.callback(this.value);
    }
    return listener;
  }
}
