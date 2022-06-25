import Behavior from "../behavior/Behavior";
import Updatable from "../behavior/Updatable";
import INode from "../node/INode";

export default class PhysicWorld extends Behavior<INode> implements Updatable {
    protected target: INode;
    
    public control(target: INode): void {
        // Rien ?!
        throw new Error("Method not implemented.");
    }
    
    update(dt: number): void {
        // Interpolation
        throw new Error("Method not implemented.");
    }
}