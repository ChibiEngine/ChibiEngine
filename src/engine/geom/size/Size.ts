import Event from "../../event/Event";
import half from "./half";

export default class Size {
  public static zero() {
    return new Size(0, 0);
  }

  private _width: number;
  private _height: number;
  public readonly onChange: Event<Size> = new Event();

  public constructor(width: number = 0, height: number = 0) {
    this._width = width;
    this._height = height;
  }

  public get width() {
    return this._width;
  }

  public get height() {
    return this._height;
  }

  public set width(width: number) {
    this._width = width;
    this.onChange.trigger(this);
  }

  public set height(height: number) {
    this._height = height;
    this.onChange.trigger(this);
  }

  public set(width: number, height: number) {
    this._width = width;
    this._height = height;
    this.onChange.trigger(this);
  }

  public get half() {
    return half(this);
  }

  public clone() {
    return new Size(this._width, this._height);
  }
}
