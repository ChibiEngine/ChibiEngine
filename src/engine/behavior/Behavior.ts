import INode from "../node/INode";

export default abstract class Behavior<T extends INode> {
    protected target: T;

    public abstract control(target: T): void;
}