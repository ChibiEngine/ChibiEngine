export interface FixedUpdatable {
    /**
     * Can be negative to be called before, or positive to be called after.
     * Default is 0.
     */
    updateCallOrder?: number;

    dontAddToUpdateList?: boolean;
    lastUpdateTime?: number;

    update(): void;

    /**
     * Number of update calls per second.
     * Default is 50.
     */
    updateRate?: number;
}

export interface VariableUpdatable {
    /**
     * Can be negative to be called before, or positive to be called after.
     * Default is 0.
     */
    updateCallOrder?: number;

    // TODO : find a better way than this strange flag?
    // Maybe let the objects remove themselves from the update list after create
    dontAddToUpdateList?: boolean;
    variableUpdate(dt: number): void;
}

type Updatable = FixedUpdatable | VariableUpdatable;

export default Updatable;

export function isUpdatable(object: any): object is Updatable {
    return isFixedUpdatable(object) || isVariableUpdatable(object)
}

export function isFixedUpdatable(object: any): object is FixedUpdatable {
    return "update" in object;
}

export function isVariableUpdatable(object: any): object is VariableUpdatable {
    return "variableUpdate" in object;
}
