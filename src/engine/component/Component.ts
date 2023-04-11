import GameObject from "../gameobjects/GameObject";
import AbstractGameObject from "../gameobjects/AbstractGameObject";

export interface AbstractComponent<Name extends string, in T extends AbstractGameObject = AbstractGameObject> {
    readonly componentName: Name;
    apply(target: T): void;
}

/*
    Component<GameObject> is assignable to Component<Sprite>
    because Sprite extends GameObject, something that is applicable to a GameObject is applicable to a Sprite
    => contravariance
*/
export default abstract class Component<Name extends string, in T extends AbstractGameObject = GameObject> implements AbstractComponent<Name, T> {
    public abstract readonly componentName: Name;
    public apply(target: T): void { }
}