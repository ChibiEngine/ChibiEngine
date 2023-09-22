import IPosition from "../geom/position/IPosition";
import Rectangle from "../geom/rect/Rectangle";
import Position from "./Position";

export default class ConstrainedPosition extends Position {
  private _positionBounds: Rectangle = null;

  public constructor(x: number, y: number) {
    super(x, y);
  }

  public setPositionBounds(x1: number, y1: number, x2: number, y2: number) {
    this._positionBounds = new Rectangle(x1, y1, x2-x1, y2-y1);
    return this;
  }

  public set x(x: number) {
    if(this._positionBounds) {
      if(x < this._positionBounds.left) {
        x = this._positionBounds.left;
      } else if(x > this._positionBounds.right) {
        x = this._positionBounds.right;
      }
    }
    this.value.x = x;
    this.onChange.trigger(this);
  }

  public get x() {
    return this.value.x;
  }

  public set y(y: number) {
    if(this._positionBounds) {
      if(y < this._positionBounds.top) {
        y = this._positionBounds.top;
      } else if(y > this._positionBounds.bottom) {
        y = this._positionBounds.bottom;
      }
    }
    this.value.y = y;
    this.onChange.trigger(this);
  }

  public get y() {
    return this.value.y;
  }

  public set(x: number|IPosition, y: number = 0) {
    if(typeof x === "number") {
      if(this._positionBounds) {
        if(x < this._positionBounds.left) {
          x = this._positionBounds.left;
        } else if(x > this._positionBounds.right) {
          x = this._positionBounds.right;
        }
        if(y < this._positionBounds.top) {
          y = this._positionBounds.top;
        } else if(y > this._positionBounds.bottom) {
          y = this._positionBounds.bottom;
        }
      }
      super.set({ x, y });
    } else {
      if(this._positionBounds) {
        if(x.x < this._positionBounds.left) {
          x.x = this._positionBounds.left;
        } else if(x.x > this._positionBounds.right) {
          x.x = this._positionBounds.right;
        }
        if(x.y < this._positionBounds.top) {
          x.y = this._positionBounds.top;
        } else if(x.y > this._positionBounds.bottom) {
          x.y = this._positionBounds.bottom;
        }
      }
      super.set(x);
    }
  }
}