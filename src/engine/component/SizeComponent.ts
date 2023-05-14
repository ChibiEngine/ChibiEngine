import Component from "./Component";
import Size from "../geom/size/Size";
import Event from "../event/Event";
import * as PIXI from "pixi.js";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import Sizeable from "../geom/size/Sizeable";

export default class SizeComponent extends Component<"sizeComponent", AbstractGameObject> implements Sizeable {
  readonly componentName: "sizeComponent";
  private _size: Size;
  public pixi: PIXI.Container;

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;

  public constructor(size: Size = Size.zero()) {
    super();
    this._size = size;
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this.pixi = target.pixi;
    this.setSize(this.size);
  }

  public get size(): Size {
    return this._size;
  }

  public setSize(size: Size): this {
    this._size = size;

    if(!this.pixi) return this;

    this._size.onChange.subscribe((size) => {
      this.pixi.width = size.width;
      this.pixi.height = size.height;
    });
    this._size.onChange.trigger(this._size);

    return this;
  }

  public get onSizeChange(): Event<Size> {
    return this._size.onChange;
  }

  public get width() {
    return this._size.width;
  }

  public set width(width: number) {
    this._size.width = width;
  }

  public get height() {
    return this._size.height;
  }

  public set height(height: number) {
    this._size.height = height;
  }
}