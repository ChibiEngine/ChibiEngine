import GameObject from "../gameobjects/GameObject";
import {FixedUpdatable} from "../gameobjects/Updatable";
import {Component} from "../component/Component";
import {Class} from "../utils/Types";

export default class PhysicBody extends Component<"body"> implements FixedUpdatable {
    readonly componentName = "body";
    readonly targetType: Class<GameObject>;

    public apply(target: GameObject): void {
        throw new Error("Method not implemented.");
    }
    
    update(): void {
        throw new Error("Method not implemented.");
    }
}