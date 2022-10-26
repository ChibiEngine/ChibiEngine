import Behavior from "../behavior/Behavior";
import Updatable from "../behavior/Updatable";
import AbstractNode from "../node/AbstractNode";

export default class PhysicBody extends Behavior<AbstractNode> implements Updatable {
    protected target: AbstractNode;
    
    public control(target: AbstractNode): void {
        throw new Error("Method not implemented.");
    }
    
    update(dt: number): void {
        throw new Error("Method not implemented.");
    }
}