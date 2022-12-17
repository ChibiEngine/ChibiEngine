import Action from "./Action";
import AbstractNode from "../node/AbstractNode";

export default class Delay extends Action<AbstractNode> {
  public constructor(duration: number) {
    super();
    this.duration(duration);
  }

  public _run(target: AbstractNode): void {
  }

  public _update(offset: number): void {
  }
}