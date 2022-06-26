import Event from "../event/Event";
import EventPromise from "../event/EventPromise";
import LoaderInfo from "./LoaderInfo";

// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default interface Loadable {
    onProgress: Event<LoaderInfo>;
    onLoaded: EventPromise<this>;
    loaderInfo: LoaderInfo;
    loaded: boolean;
    loading: boolean;
    bytesLoaded: number;
    bytesTotal: number;
}

export type LoadablePromise<T extends Loadable> = T & Promise<T>;

export function makePromise<T extends Loadable>(resource: T): LoadablePromise<T> {
    const promise = resource.onLoaded;
    return Object.assign(resource, promise);
}
