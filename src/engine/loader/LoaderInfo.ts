import Event from "../event/Event";

export default class LoaderInfo {
    private _bytesLoaded: number = 0;
    private _bytesTotal: number = 0;

    public readonly onProgress: Event<LoaderInfo> = new Event();

    private readonly children: LoaderInfo[] = [];

    constructor() {
        this.onChildProgress = this.onChildProgress.bind(this);
    }

    public get bytesLoaded(): number {
        return this._bytesLoaded;
    }

    public set bytesLoaded(value: number) {
        this._bytesLoaded = value;
        this.onProgress.trigger(this);
    }

    public get bytesTotal(): number {
        return this._bytesTotal;
    }

    public set bytesTotal(value: number) {
        this._bytesTotal = value;
    }

    public add(child: LoaderInfo) {
        if(this.children.indexOf(child) >= 0) return;
        this.children.push(child);
        child.onProgress.subscribe(this.onChildProgress);
    }

    private onChildProgress(child: LoaderInfo) {
        this.bytesTotal = this.children.reduce((sum, child) => sum + child.bytesTotal, 0);
        this.bytesLoaded = this.children.reduce((sum, child) => sum + child.bytesLoaded, 0);
    }
}