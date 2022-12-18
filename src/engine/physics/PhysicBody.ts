import Behavior from "../behavior/Behavior";
import GameObject from "../gameobjects/GameObject";
import Updatable from "../gameobjects/Updatable";

export default class PhysicBody extends Behavior<GameObject> implements Updatable {
    protected target: GameObject;
    
    public setTarget(target: GameObject): void {
        throw new Error("Method not implemented.");
    }
    
    update(dt: number): void {
        throw new Error("Method not implemented.");
    }
}