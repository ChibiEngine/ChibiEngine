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

    target.onLoaded(() => {
      this.originalSize = { width: this._pixi.width/this._pixi.scale.x, height: this._pixi.height/this._pixi.scale.y };
      this.set({ width: this.originalSize.width*this.scaleX, height: this.originalSize.height*this.scaleY });
    });

    this.onChange.subscribe((size) => {
      // TODO : disable this listener when transition is set?
      this.assign(size);
    }).triggerNowIfValueExists();

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
      width: Linear.INSTANCE.interpolate(this.previous.width, this.next.width, alpha),
      height: Linear.INSTANCE.interpolate(this.previous.height, this.next.height, alpha)
    };
  }

  protected assign(value: ISize) {
    this._pixi.width = value.width;
    this._pixi.height = value.height;
  }
}