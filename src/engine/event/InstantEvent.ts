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

  public subscribeOnce(listener: (value: T) => void) {
    super.subscribeOnce(listener);
    if(this.loaded) {
      listener(this.value);
    }
  }

  public subscribe(listener: (value: T) => void) {
    super.subscribe(listener);
    if(this.loaded) {
      listener(this.value);
    }
  }
}
