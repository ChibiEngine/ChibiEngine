import Action from "./Action";
import AbstractNode from "../node/AbstractNode";

export default class Callback extends Action<AbstractNode> {
  public constructor(private readonly callback: () => void) {
    super();
  }

  public _run(target: AbstractNode): void {
    this.callback();
    this.finish();
  }

  public _update(offset: number): void {
  }
}