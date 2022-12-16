import Action from "./Action";
import AbstractNode from "../node/AbstractNode";

class MoveAction extends Action<AbstractNode> {
  protected target: AbstractNode;

  private startX: number;
  private startY: number;

  private endX: number;
  private endY: number;

  public constructor(private readonly x: number, private readonly y: number, private readonly relative: boolean = false) {
    super();
  }

  public _run(target: AbstractNode) {
    this.startX = target.x;
    this.startY = target.y;
    this.endX = this.relative ? this.startX + this.x : this.x;
    this.endY = this.relative ? this.startY + this.y : this.y;
  }

  public _update(offset: number) {
    this.target.x = this.startX * (1-offset) + this.endX * offset;
    this.target.y = this.startY * (1-offset) + this.endY * offset;
  }

  public static to(x: number, y: number): MoveAction {
    return new MoveAction(x, y);
  }

  public static by(x: number, y: number): MoveAction {
    return new MoveAction(x, y, true);
  }
}

const Move = MoveAction;
export default Move;