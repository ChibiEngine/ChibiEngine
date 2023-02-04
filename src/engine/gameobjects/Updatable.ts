export default interface Updatable {
    update(dt: number): void;
}

export function isUpdatable(object: any): object is Updatable {
    return "update" in object;
}