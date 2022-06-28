import Event from "../event/Event";
import EventPromise, {makePromise as makeEventPromise} from "../event/EventPromise";
import LoaderInfo from "./LoaderInfo";

// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default abstract class Loadable {
    public readonly loaderInfo: LoaderInfo = new LoaderInfo();

    public readonly onProgress: Event<LoaderInfo> = new Event();
    public readonly onLoaded: EventPromise<this> = makeEventPromise(new Event<this>());

    protected _loaded: boolean = false;
    protected _loading: boolean = false;

    public get loaded() {
        return this._loaded;
    }

    public get loading() {
        return this._loading;
    }

    public get bytesLoaded(): number {
        return this.loaderInfo.bytesLoaded;
    }

    public get bytesTotal(): number {
        return this.loaderInfo.bytesTotal;
    }

    protected abstract create(): Promise<void>;
    protected abstract destroy(): void;
}

export type LoadablePromise<T extends Loadable> = T & Promise<T>;

export function makePromise<T extends Loadable>(resource: T): LoadablePromise<T> {
    const promise = resource.onLoaded;
    return Object.assign(resource, promise);
}
