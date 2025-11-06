import IPosition from "../geom/position/IPosition";
import Rectangle from "../geom/rect/Rectangle";
import Position from "./Position";
import IRectangle from "../geom/rect/IRectangle";
import IBounds from "../geom/rect/IBounds";

export default class ConstrainedPosition extends Position {
  private _positionBounds: Rectangle = null;

  public constructor(x: number, y: number) {
    super(x, y);
  }

  public set bounds(bounds: IBounds) {
    this._positionBounds = Rectangle.fromBounds(bounds);
  }

  public get bounds(): IBounds {
    return this._positionBounds.toBounds();
  }

  public setPositionBounds(x1: number, y1: number, x2: number, y2: number) {
    this._positionBounds = Rectangle.fromBounds({ x1, y1, x2, y2 });
    return this;
  }

  public set x(x: number) {
    if(this._positionBounds) {
      x = Math.max(this._positionBounds.left, Math.min(this._positionBounds.right, x));
    }
    this.current.x = x;
    this.onChange.trigger(this);
  }

  public get x() {
    return this.current.x;
  }

  public set y(y: number) {
    if(this._positionBounds) {
      y = Math.max(this._positionBounds.top, Math.min(this._positionBounds.bottom, y));
    }
    this.current.y = y;
    this.onChange.trigger(this);
  }

  public get y() {
    return this.current.y;
  }

  public set(x: number | IPosition, y: number = 0) {
    if(typeof x === "number") {
      if(this._positionBounds) {
        x = Math.max(this._positionBounds.left, Math.min(this._positionBounds.right, x));
        y = Math.max(this._positionBounds.top, Math.min(this._positionBounds.bottom, y));
      }
      super.set({ x, y });
    } else {
      if(this._positionBounds) {
        x.x = Math.max(this._positionBounds.left, Math.min(this._positionBounds.right, x.x));
        x.y = Math.max(this._positionBounds.top, Math.min(this._positionBounds.bottom, x.y));
      }
      super.set(x);
    }
  }
}