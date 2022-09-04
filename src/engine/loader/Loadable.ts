import Event from "../event/Event";
import LoaderInfo from "./LoaderInfo";

// Inspired by https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/LoaderInfo.html
// https://help.adobe.com/fr_FR/FlashPlatform/reference/actionscript/3/flash/display/Loader.html

export default abstract class Loadable {
    public readonly loaderInfo: LoaderInfo = new LoaderInfo();

    // TODO: pb si les sous-classes utilisent un LoaderInfoAggregate
    public readonly onProgress: Event<LoaderInfo> = this.loaderInfo.onProgress;
    public readonly onLoaded: Event<this> = new Event<this>();

    private readonly loadableChildren: Loadable[] = [];

    private _isLoaded: boolean = false;
    private _isLoading: boolean = false;

    protected constructor() {
        this.onChildLoaded = this.onChildLoaded.bind(this);
    }

    protected addLoadableChild(child: Loadable) {
        this.loadableChildren.push(child);
        // this.loaderInfo.add(child.loaderInfo);
        child.loaded.then(this.onChildLoaded);
    }

    private allChildrenLoaded(): boolean {
        return !this.loadableChildren.some(child => !child.isLoaded);
    }

    private hasChildrenLoading(): boolean {
        return this.loadableChildren.some(child => child.isLoading);
    }

    private onChildLoaded(_: Loadable) {
        if(this._isLoaded && this.allChildrenLoaded()) {
            this.onLoaded.trigger(this);
        }
    }

    public loadSelf() {
        this.loading();
        this.create().then(() => {
            this.finishLoading();
            return this;
        });
    }

    public loading() {
        if(this._isLoading) return;
        this._isLoading = true;
        this._isLoaded = false;
    }

    public finishLoading() {
        if(!this._isLoading || this._isLoaded) return;
        this._isLoading = false;
        this._isLoaded = true;
        if(this.allChildrenLoaded()) {
            this.onLoaded.trigger(this);
        }
    }

    public get loaded(): Promise<this> {
        return this.onLoaded.promise;
    }

    public get isLoaded() {
        return this._isLoaded && this.allChildrenLoaded();
    }

    public get isLoading() {
        return this._isLoading || this.hasChildrenLoading();
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
