import Resource from "./Resource";

export default class Text extends Resource {
    public constructor(url: string) {
        super(url);
    }

    protected _load(): Promise<this> {
        throw new Error("Method not implemented.");
    }
    
    protected destroy(): void {
        throw new Error("Method not implemented.");
    }
    
}