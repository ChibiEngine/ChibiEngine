import Event from "../event/Event";
import * as PIXI from "pixi.js";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import Sizeable from "../geom/size/Sizeable";
import TransitionableComponent from "./TransitionableComponent";
import ISize from "../geom/size/ISize";

export default class Size extends TransitionableComponent<"size", ISize, AbstractGameObject> implements Sizeable {
  readonly componentName = "size";
  public _pixi: PIXI.Container;
  private originalSize: ISize;

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;

  public constructor(width: number = 0, height: number = 0) {
    super({ width: width, height: height});
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this._pixi = target.pixi;

    target.onLoaded(() => {
      this.originalSize = { width: this._pixi.width, height: this._pixi.height };
      this.set({ width: this._pixi.width, height: this._pixi.height });
    });

    this.onChange.subscribe((size) => {
      // TODO : disable this listener when transition is set?
      this.assign(size);
    });

    if(this.updateDt) {
      this.enableTransition();
    }
  }

  public get width() {
    return this.value.width;
  }

  public get height() {
    return this.value.height;
  }

  public set width(width: number) {
    this.value.width = width;
    this.onChange.trigger(this);
  }

  public set height(height: number) {
    this.value.height = height;
    this.onChange.trigger(this);
  }

  public setScale(scale: number) {
    this.set({ width: this.originalSize.width * scale, height: this.originalSize.height * scale });
  }

  public set(width: number|ISize, height: number = 0) {
    if(typeof width === "number") {
      console.trace("set ", width, height)
      super.set({ width, height });
    } else {
      super.set(width);
    }
  }

  public get half() {
    return new Size(this.value.width / 2, this.value.height / 2);
  }

  public clone() {
    return new Size(this.value.width, this.value.width);
  }

  public get onSizeChange(): Event<this> {
    return this.onChange;
  }

  public interpolate(alpha: number): ISize {
    return {
      width: this.next.width * alpha + this.previous.width * (1 - alpha),
      height: this.next.height * alpha + this.previous.height * (1 - alpha)
    };
  }

  protected assign(value: ISize) {
    this._pixi.width = value.width;
    this._pixi.height = value.height;
  }
}