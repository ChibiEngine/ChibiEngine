import GameObject from "../gameobjects/GameObject";
import {Class, Typed} from "../utils/Typed";

/**
 * Comment partager le behavior d'un parent à ses enfants ?
 * => Cas du PhysicWorld et PhysicBody
 */
export default abstract class Component<Name extends string, T extends GameObject = GameObject> implements Typed<T> {
    public abstract readonly name: Name;

    public targetType: Class<T>|null = null;

    protected target: T;

    public apply(target: T) {
        this.target = target;
    }
}