import Event from "../event/Event";
import LoaderInfo from "./LoaderInfo";

// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default abstract class Loadable {
    public readonly loaderInfo: LoaderInfo = new LoaderInfo();

    // TODO: pb si les sous-classes utilisent un LoaderInfoAggregate
    public readonly onProgress: Event<LoaderInfo> = this.loaderInfo.onProgress;
    public readonly onLoaded: Event<this> = new Event<this>();

    protected _isLoaded: boolean = false;
    protected _isLoading: boolean = false;

    public get loaded(): Promise<this> {
        return this.onLoaded.promise();
    }

    public get isLoaded() {
        return this._isLoaded;
    }

    public get isLoading() {
        return this._isLoading;
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
