import Resource from "./Resource";

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

    protected async create(): Promise<void> {
        const blob = await this.request(this.path);
        console.log("Request after");
        console.log(blob);

        this._text = await blob.text();
    }

    protected destroy(): void {
    }
    
}