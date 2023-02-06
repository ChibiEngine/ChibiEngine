import Event from "../../event/Event";

export default class Position {
  public static zero() {
    return new Position(0, 0);
  }

  protected _x: number;
  protected _y: number;
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

  public setX(x: number) {
    this._x = x;
    this.onChange.trigger(this);
  }

  public setY(y: number) {
    this._y = y;
    this.onChange.trigger(this);
  }

  public addX(number: number): this {
    this.set(this._x + number, this._y);
    return this;
  }

  public addY(number: number): this {
    this.set(this._x, this._y + number);
    return this;
  }

  public clone() {
    return new Position(this._x, this._y);
  }

  public plusY(dy: number): Position {
    return new Position(this.x, this.y + dy);
  }

  public plusX(dx: number): Position {
    return new Position(this.x + dx, this.y);
  }
}
