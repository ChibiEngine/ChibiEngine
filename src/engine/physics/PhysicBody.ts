import GameObject from "../gameobjects/GameObject";
import UpdateLoopListener from "../gameobjects/UpdateLoopListener";
import Component from "../component/Component";
import {Class} from "../utils/Typed";

export default class PhysicBody extends Component<GameObject> implements UpdateLoopListener {
    readonly name = "body";
    readonly targetType: Class<GameObject>;

    public apply(target: GameObject): void {
        throw new Error("Method not implemented.");
    }
    
    update(): void {
        throw new Error("Method not implemented.");
    }
}