import Event from "../../event/Event";
import Vec2 from "../vec/Vec2";

export default class Position {
  public static zero() {
    return new Position(0, 0);
  }

  protected last: Vec2;
  protected current: Vec2;

  public readonly onChange: Event<Position> = new Event();
  // TODO : create custom constructor to make Event type of Function<Callback> so we can use it like position.onChange(() => { ... })

  public constructor(x: number = 0, y: number = 0) {
    this.current = { x, y };
  }

  public get x() {
    return this.current.x;
  }

  public get y() {
    return this.current.y;
  }

  public set x(x: number) {
    this.last.x = this.current.x;
    this.current.x = x;
    this.onChange.trigger(this);
  }

  public set y(y: number) {
    this.last.y = this.current.y;
    this.current.y = y;
    this.onChange.trigger(this);
  }

  public set(x: number, y: number) {
    this.last = { ...this.current }
    this.current = { x, y };
    this.onChange.trigger(this);
  }

  public setX(x: number) {
    this.last.x = this.current.x;
    this.current.x = x;
    this.onChange.trigger(this);
  }

  public setY(y: number) {
    this.last.y = this.current.y;
    this.current.y = y;
    this.onChange.trigger(this);
  }

  public addX(number: number): this {
    this.set(this.x + number, this.y);
    return this;
  }

  public addY(number: number): this {
    this.set(this.x, this.y + number);
    return this;
  }

  public clone() {
    return new Position(this.x, this.y);
  }

  public plusY(dy: number): Position {
    return new Position(this.x, this.y + dy);
  }

  public plusX(dx: number): Position {
    return new Position(this.x + dx, this.y);
  }

  public interpolate(alpha: number): Vec2 {
    return {
      x: this.current.x * alpha + this.last.x * (1 - alpha),
      y: this.current.y * alpha + this.last.y * (1 - alpha)
    }
  }
}
