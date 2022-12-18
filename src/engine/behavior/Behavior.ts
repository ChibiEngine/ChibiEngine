import GameObject from "../gameobjects/GameObject";
import Updatable from "../gameobjects/Updatable";
import {Class, Typed} from "../utils/Typed";

/**
 * Comment partager le behavior d'un parent à ses enfants ?
 * => Cas du PhysicWorld et PhysicBody
 * 
 */
export default abstract class Behavior implements Updatable, Typed<GameObject> {
    public abstract readonly targetType: Class<GameObject>;
    protected target: GameObject;

    public setTarget(target: GameObject) {
        this.target = target;
    }

    abstract update(dt: number): void;



    // public abstract control(target: T, requirements: (typeof Behavior)[]): void;
    // 
    // public abstract require(): (typeof Behavior)[];
    // BehaviorRequirementsNotMetException levée à la fin du create si le parent n'a pas les comportements requis
}

// Example1
// create() {
//     this.addBehavior(new PhysicWorld(-9.8));
//
// }

// ServerPlayer
// create() {
//     this.addBehavior(new Movable());
//     this.addBehavior(new ServerMovable());
// }