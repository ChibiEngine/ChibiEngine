import {Container, Point} from "pixi.js";

import Event from "../event/Event";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import Sizeable from "../geom/size/Sizeable";
import TransitionableComponent from "./TransitionableComponent";
import ISize from "../geom/size/ISize";
import IPosition from "../geom/position/IPosition";
import Linear from "../math/easing/Linear";

export default class Size extends TransitionableComponent<"size", ISize, AbstractGameObject> implements Sizeable {
  readonly componentName = "size";
  public _pixi: Container;
  private originalSize: ISize;

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;
  private scaleX: number = 1;
  private scaleY: number = 1;

  public constructor(width: number = 0, height: number = 0) {
    super({ width: width, height: height});
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this._pixi = target.pixi;

    this.originalSize = { width: this._pixi.width/this._pixi.scale.x, height: this._pixi.height/this._pixi.scale.y };
    this.set({ width: this.originalSize.width*this.scaleX, height: this.originalSize.height*this.scaleY });

    if(this.transitionMillis) {
      this.enableTransition();
    }
  }

  // TODO: call this when target is updated
  public updateSize() {
    if(this._pixi&&this.originalSize) {
      this.originalSize = { width: this._pixi.width/this._pixi.scale.x, height: this._pixi.height/this._pixi.scale.y };
      this.set({ width: this.originalSize.width*this.scaleX, height: this.originalSize.height*this.scaleY });
    }
  }

  public get width() {
    return this.current.width;
  }

  public get height() {
    return this.current.height;
  }

  public set width(width: number) {
    this.current.width = width;
    this.onChange.trigger(this);
  }

  public set height(height: number) {
    this.current.height = height;
    this.onChange.trigger(this);
  }

  public get scale(): IPosition {
    return this._pixi.scale;
  }

  public setScale(scaleX: number, scaleY: number = scaleX) {
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    if(this.originalSize) {
      this.set({ width: this.originalSize.width * scaleX, height: this.originalSize.height * scaleY });
    }
    return this;
  }

  public set(width: number|ISize, height: number = 0) {
    if(typeof width === "number") {
      super.set({ width, height });
    } else {
      super.set({width: width.width, height: width.height});
    }
  }

  public get half() {
    return new Size(this.current.width / 2, this.current.height / 2);
  }

  public clone() {
    return new Size(this.current.width, this.current.width);
  }

  public get onSizeChange(): Event<this> {
    return this.onChange;
  }

  public interpolate(from: ISize, to: ISize, alpha: number): ISize {
    return {
      width: Linear.INSTANCE.interpolate(from.width, to.width, alpha),
      height: Linear.INSTANCE.interpolate(from.height, to.height, alpha)
    };
  }

  protected assign(value: ISize) {
    this._pixi.width = value.width;
    this._pixi.height = value.height;
  }
}