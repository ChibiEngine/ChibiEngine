export interface FixedUpdatable {
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
