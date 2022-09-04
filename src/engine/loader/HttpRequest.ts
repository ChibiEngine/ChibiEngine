import Loadable from "./Loadable";

export default class HttpRequest extends Loadable {
    private _response: Blob;

    public constructor(private readonly url: string) {
        super();
    }

    public create(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.addEventListener("progress", (event) => {
                if (event.lengthComputable) {
                    this.loaderInfo.bytesTotal = event.total;
                    this.loaderInfo.bytesLoaded = event.loaded;
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

    protected destroy(): void {
        throw new Error("Method not implemented.");
    }

    get response(): Blob {
        return this._response;
    }
}