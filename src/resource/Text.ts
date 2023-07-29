import Resource from "./Resource";
import Blob from "./Blob";

export default class Text extends Resource {
    private _text: string;

    public constructor(path: string) {
        super(path);
    }

    public get text(): string {
        return this._text;
    }

    public get content(): string {
        return this._text;
    }

    protected async _create(): Promise<void> {
        const blob = await this.load(new Blob(this.path));

        this._text = await blob.text();
    }

    protected async _destroy() {
    }
    
}