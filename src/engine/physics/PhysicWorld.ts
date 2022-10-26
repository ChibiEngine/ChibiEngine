import Behavior from "../behavior/Behavior";
import Updatable from "../behavior/Updatable";
import AbstractNode from "../node/AbstractNode";

export default class PhysicWorld extends Behavior<AbstractNode> implements Updatable {
    protected target: AbstractNode;
    
    public control(target: AbstractNode): void {
        // Rien ?!
        throw new Error("Method not implemented.");
    }
    
    update(dt: number): void {
        // Interpolation
        throw new Error("Method not implemented.");
    }
}