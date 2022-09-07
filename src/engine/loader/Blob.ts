import Resource from "../resource/Resource";
import {DomBlob} from "../util/dom";

export default class Blob extends Resource {
    type = "blob";

    private _response: DomBlob;

    private _bytesLoaded: number = 0;
    private _bytesTotal: number = 0;

    public constructor(private readonly url: string) {
        super(url);
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
                    console.warn(`The HttpRequest(${this.url}) got readyState=${xhr.readyState} and status=${xhr.status}`);
                }
                this._response = xhr.response;
                resolve();
            });

            xhr.responseType = 'blob';
            xhr.open("GET", this.url, true);
            xhr.send();
        });
    }


    get bytesLoaded(): number {
        return this._bytesLoaded;
    }

    get bytesTotal(): number {
        return this._bytesTotal;
    }

    public get response(): DomBlob {
        return this._response;
    }

    public get blob(): Promise<DomBlob> {
        return new Promise(async (resolve, reject) => {
            await this.loaded;
            resolve(this._response);
        });
    }

    protected async _destroy() {
        throw new Error("Method not implemented.");
    }
}