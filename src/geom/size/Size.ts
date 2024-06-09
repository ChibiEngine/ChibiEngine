import ISize from "./ISize";
import Event from "../../event/Event";

export default class Size implements ISize {
  private _width: number;
  private _height: number;

  public readonly onChange: Event<ISize> = new Event();

  public constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  public get width(): number {
    return this._width;
  }

  public set width(value: number) {
    this._width = value;
    this.onChange.trigger(this);
  }

  public get height(): number {
    return this._height;
  }

  public set height(value: number) {
    this._height = value;
    this.onChange.trigger(this);
  }

  public set(width: number, height: number): void {
    this._width = width;
    this._height = height;
    this.onChange.trigger(this);
  }

  clone(): ISize {
    return new Size(this._width, this._height);
  }
}