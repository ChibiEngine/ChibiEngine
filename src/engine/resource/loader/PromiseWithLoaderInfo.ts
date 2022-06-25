// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

import Event from "../../event/Event";
import LoaderInfo from "./LoaderInfo";

export default class PromiseWithLoaderInfo<T> extends Promise<T> {
    public readonly loaderInfo: LoaderInfo = new LoaderInfo();
    public readonly onProgress: Event<LoaderInfo> = this.loaderInfo.onProgress
    public readonly onComplete: Event<LoaderInfo> = new Event();
    
    public constructor(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        super(executor);
        this.onProgress.subscribe(this._onProgress);
    }

    private _onProgress(loaderInfo: LoaderInfo) {
        if(loaderInfo.bytesTotal === loaderInfo.bytesLoaded) {
            this.onComplete.trigger(loaderInfo);
            this.onProgress.unsubscribe(this._onProgress);
        }
    }
};
