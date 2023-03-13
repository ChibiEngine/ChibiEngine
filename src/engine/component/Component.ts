import GameObject from "../gameobjects/GameObject";
import Updatable from "../gameobjects/Updatable";
import {Class, Typed} from "../utils/Typed";

/**
 * Comment partager le behavior d'un parent à ses enfants ?
 * => Cas du PhysicWorld et PhysicBody
 * 
 */
export default abstract class Component<T extends GameObject> implements Typed<T> {
    public abstract readonly name: string;

    public abstract readonly targetType: Class<T>;
    protected target: T;

    public apply(target: T) {
        this.target = target;
    }
}