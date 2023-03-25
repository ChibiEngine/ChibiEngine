import GameObject from "../gameobjects/GameObject";
import {Class, Typed} from "../utils/Typed";

/*
    Component<GameObject> is assignable to Component<Sprite>
    because Sprite extends GameObject, something that is applicable to a GameObject is applicable to a Sprite
    => contravariance
*/
export default abstract class Component<Name extends string, in T extends GameObject = GameObject> {
    public abstract readonly name: Name;

    public apply(target: T): void {

    }
}