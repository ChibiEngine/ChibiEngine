import Event from "../../event/Event";

export default class Position {
  public static zero() {
    return new Position(0, 0);
  }

  private _x: number;
  private _y: number;
  public readonly onChange: Event<Position> = new Event();

  public constructor(x: number = 0, y: number = 0) {
    this._x = x;
    this._y = y;
  }

  public get x() {
    return this._x;
  }
  public get y() {
    return this._y;
  }

  public set x(x: number) {
    this._x = x;
    this.onChange.trigger(this);
  }
  public set y(y: number) {
    this._y = y;
    this.onChange.trigger(this);
  }

  public set(x: number, y: number) {
    this._x = x;
    this._y = y;
    this.onChange.trigger(this);
  }

  public clone() {
    return new Position(this._x, this._y);
  }
}
