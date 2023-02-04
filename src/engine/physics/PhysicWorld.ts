import Component from "../behavior/Component";
import GameObject from "../gameobjects/GameObject";
import Updatable from "../gameobjects/Updatable";

export default class PhysicWorld extends Component implements Updatable {
    readonly targetType = GameObject;
    protected target: GameObject;

    public apply(target: GameObject): void {
        // Rien ?!
        throw new Error("Method not implemented.");
    }

    update(dt: number): void {
        // Interpolation
        throw new Error("Method not implemented.");
    }

}