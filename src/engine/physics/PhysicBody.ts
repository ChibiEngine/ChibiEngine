import Component from "../behavior/Component";
import GameObject from "../gameobjects/GameObject";
import Updatable from "../gameobjects/Updatable";

export default class PhysicBody extends Component<GameObject> implements Updatable {
    protected target: GameObject;
    
    public apply(target: GameObject): void {
        throw new Error("Method not implemented.");
    }
    
    update(dt: number): void {
        throw new Error("Method not implemented.");
    }
}