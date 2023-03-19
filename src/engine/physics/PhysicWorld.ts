import GameObject from "../gameobjects/GameObject";
import {FixedUpdatable} from "../gameobjects/Updatable";
import Component from "../component/Component";

export default class PhysicWorld extends Component<GameObject> implements FixedUpdatable {
    readonly name = "world";

    readonly targetType = GameObject;
    protected target: GameObject;

    public readonly updateRate = 50;

    public apply(target: GameObject): void {
        // Rien ?!
        throw new Error("Method not implemented.");
    }

    update(): void {
        // Interpolation
        throw new Error("Method not implemented.");
    }
}