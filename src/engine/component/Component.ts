import GameObject from "../gameobjects/GameObject";
import {Class, Typed} from "../utils/Typed";

/**
 * Comment partager le behavior d'un parent à ses enfants ?
 * => Cas du PhysicWorld et PhysicBody
 */
export default abstract class Component<Name extends string, T extends GameObject = GameObject> {
    public abstract readonly name: Name;

    protected target: T|null = null;

    public apply(target: T): void {

    }
}