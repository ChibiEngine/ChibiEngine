import Behavior from "../behavior/Behavior";
import GameObject from "../gameobjects/GameObject";
import Updatable from "../gameobjects/Updatable";

export default class PhysicWorld extends Behavior<GameObject> implements Updatable {
    protected target: GameObject;
    
    public setTarget(target: GameObject): void {
        // Rien ?!
        throw new Error("Method not implemented.");
    }
    
    update(dt: number): void {
        // Interpolation
        throw new Error("Method not implemented.");
    }
}