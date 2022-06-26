import Event from "./Event";

type EventPromise<T> = Event<T> & Promise<T>
export default EventPromise;

export function makePromise<T, E extends Event<T>>(event: E): EventPromise<T> {
    const promise = event.promise();
    return Object.assign(event, promise);
}
