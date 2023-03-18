export default interface UpdateLoopListener {
    lastUpdateTime?: number;

    update(): void;

    /**
     * Number of update calls per second.
     * Default is 50.
     */
    updateRate?: number;
}

export function isUpdateLoopListener(object: any): object is UpdateLoopListener {
    return "update" in object;
}