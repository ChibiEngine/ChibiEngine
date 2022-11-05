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

  public clone() {
    return new Position(this._x, this._y);
  }

  public addX(number: number): this {
    this.set(this._x + number, this._y);
    return this;
  }

  public addY(number: number): this {
    this.set(this._x, this._y + number);
    return this;
  }

  /**
   * Create a new position derived from this position.
   * update will be called on each change of this position.
   *
   * Example:
   * <code>
   *   const position = Position.zero();
   *   const derived = position.derive(pos => pos.x += 10);
   *   console.log(derived.x); // 10
   *   position.x = 10;
   *   console.log(derived.x); // 20
   * </code>
   * @param update
   */
  public derive(update: (position: Position) => void) {
    return new ReactivePosition(this, update);
  }

  /**
   * Alias for Position#derive
   * Create a new position derived from this position.
   * update will be called on each change of this position.
   *
   * Example:
   * <code>
   *   const position = Position.zero();
   *   const derived = position.with(pos => pos.x += 10);
   *   console.log(derived.x); // 10
   *   position.x = 10;
   *   console.log(derived.x); // 20
   * </code>
   * @param update
   */
  public with(update: (position: Position) => void) {
    return new ReactivePosition(this, update);
  }

}

export class ReactivePosition extends Position {
  public constructor(reference: Position, update: (position: Position) => void) {
    super(reference.x, reference.y);

    reference.onChange.subscribe(() => {
      this._x = reference.x;
      this._y = reference.y;
      update(this);
    });
  }
}