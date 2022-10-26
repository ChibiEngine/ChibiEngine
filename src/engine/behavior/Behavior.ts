import AbstractNode from "../node/AbstractNode";

/**
 * Comment partager le behavior d'un parent à ses enfants ?
 * => Cas du PhysicWorld et PhysicBody
 * 
 */
export default abstract class Behavior<T extends AbstractNode> {
    protected target: T;

    public abstract control(target: T): void;
    
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