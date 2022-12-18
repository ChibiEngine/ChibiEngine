import Action from "./Action";
import GameObject from "../gameobjects/GameObject";

class MoveAction extends Action {
  readonly targetType = GameObject;
  protected target: GameObject;

  private startX: number;
  private startY: number;

  private endX: number;
  private endY: number;

  public constructor(private readonly x: number, private readonly y: number, private readonly relative: boolean = false) {
    super();
  }

  public _run(target: GameObject) {
    this.startX = target.x;
    this.startY = target.y;
    this.endX = this.relative ? this.startX + this.x : this.x;
    this.endY = this.relative ? this.startY + this.y : this.y;
  }

  public _update(offset: number) {
    this.target.x = this.startX * (1-offset) + this.endX * offset;
    this.target.y = this.startY * (1-offset) + this.endY * offset;
  }
}

export class MoveBy extends MoveAction {
  public constructor(x: number, y: number) {
    super(x, y, true);
  }
}

export class MoveTo extends MoveAction {
  public constructor(x: number, y: number) {
    super(x, y, false);
  }
}