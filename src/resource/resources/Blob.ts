import Resource from "../Resource";
import {DomBlob} from "../../utils/dom";

//@ts-ignore TODO remove implements DomBlob ?
export default class Blob extends Resource implements DomBlob {
    type = "blob";

    private _content: DomBlob;
    private _url: string = null;

    private _bytesLoaded: number = 0;
    private _bytesTotal: number = 0;

    public constructor(path: string) {
        super(path);
    }

    public async _create() {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    this._bytesTotal = event.total;
                    this._bytesLoaded = event.loaded;
                    this.onProgress.trigger(this);
                }
            });

            xhr.addEventListener("error", (event) => {
                reject(event);
            });

            xhr.addEventListener("loadend", () => {
                if(!(xhr.readyState === 4 && xhr.status === 200)){
                    console.warn(`The HttpRequest(${this.path}) got readyState=${xhr.readyState} and status=${xhr.status}`);
                }
                this._content = xhr.response;
                resolve();
            });

            xhr.responseType = 'blob';
            xhr.open("GET", this.path, true);
            xhr.send();
        });
    }

    get bytesLoaded(): number {
        return this._bytesLoaded;
    }

    get bytesTotal(): number {
        return this._bytesTotal;
    }

    public get content(): DomBlob {
        return this._content;
    }

    public get url(): string {
        if(this._url === null){
            this._url = URL.createObjectURL(this._content);
        }
        return this._url;
    }

    public get size() {
        return this._content.size;
    }

    public text(): Promise<string> {
        return this._content.text();
    }

    public arrayBuffer(): Promise<ArrayBuffer> {
        return this._content.arrayBuffer();
    }

    public stream(): ReadableStream<any> {
        return this._content.stream();
    }

    public slice(start?: number, end?: number, contentType?: string): DomBlob {
        return this._content.slice(start, end, contentType);
    }

    protected async _destroy() {
        console.warn("destroy: Method not implemented.");
    }
}