import Resource from "./Resource";

export default class Text extends Resource {
    public constructor(url: string) {
        super(url);
    }

    protected create(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    protected destroy(): void {
        throw new Error("Method not implemented.");
    }
    
}