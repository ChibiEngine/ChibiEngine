import Event from "../../event/Event";

export default class LoaderInfo {
    private _bytesLoaded: number = -1;
    public bytesTotal: number = -1;

    public readonly onProgress: Event<LoaderInfo> = new Event();

    public get bytesLoaded(): number {
        return this._bytesLoaded;
    }

    public set bytesLoaded(value: number) {
        this._bytesLoaded = value;
        this.onProgress.trigger(this);
    }
};