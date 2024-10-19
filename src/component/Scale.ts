import {Container} from "pixi.js";

import {ChibiEvent} from "../event/ChibiEvent";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import TransitionableComponent from "./TransitionableComponent";
import ISize from "../geom/size/ISize";
import Linear from "../math/easing/Linear";
import IScale from "../geom/scale/IScale";
import Scalable from "../geom/scale/Scalable";

export default class Scale extends TransitionableComponent<"scale", IScale, AbstractGameObject> implements Scalable {
  readonly componentName = "scale";
  public _pixi: Container;
  private originalSize: ISize;

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;

  public constructor(x: number = 1, y: number = 1) {
    super({x: 1, y: 1});
  }

  public async apply(target: AbstractGameObject) {
    this.target = target;
    // @ts-ignore TODO: fix this
    this._pixi = target.pixi;

    this.originalSize = {width: this._pixi.width / Math.abs(this._pixi.scale.x), height: this._pixi.height / Math.abs(this._pixi.scale.y)};

    this.onChange.subscribe((position) => {
      // TODO : disable this listener when transition is set?
      this.assign(position);
    }).triggerNowIfValueExists();

    if (this.transitionMillis) {
      this.enableTransition();
    }
  }

  protected updateOriginalSize() {
    // @ts-ignore
    this._pixi = this.target.pixi;
    this.originalSize = {width: this._pixi.width / Math.abs(this._pixi.scale.x), height: this._pixi.height / Math.abs(this._pixi.scale.y)};
  }

  public get x() {
    return this.current.x;
  }

  public set x(x: number) {
    this.current.x = x;
    this.onChange.trigger(this);
  }

  public get y() {
    return this.current.y;
  }

  public set y(y: number) {
    this.current.y = y;
    this.onChange.trigger(this);
  }

  public get width() {
    return this.originalSize.width * Math.abs(this.current.x);
  }

  public get height() {
    return this.originalSize.height * Math.abs(this.current.y);
  }

  public set width(width: number) {
    if (width < 0) {
      this.current.x = -1;
      width = Math.abs(width);
    }
    this.current.x = width / this.originalSize.width;
    this.onChange.trigger(this);
  }

  public set height(height: number) {
    if (height < 0) {
      this.current.x = -1;
      height = Math.abs(height);
    }
    this.current.y = height / this.originalSize.height;
    this.onChange.trigger(this);
  }

   public setScale(x: number, y: number = x): this {
    this.set({x, y});
    return this.gameobject;
  }

  public setSize(width: number, height: number) {
    if (width < 0) {
      this.current.x = -1;
      width = Math.abs(width);
    }
    this.current.x = width / this.originalSize.width;

    if (height < 0) {
      this.current.x = -1;
      height = Math.abs(height);
    }
    this.current.y = height / this.originalSize.height;

    this.onChange.trigger(this);
    return this.gameobject;
  }

  public set(x: number | IScale, y: number = 0) {
    if (typeof x === "number") {
      super.set({x, y});
    } else {
      super.set({x: x.x, y: x.y});
    }
  }

  public clone() {
    return new Scale(this.current.x, this.current.y);
  }

  public get onScaleChange(): ChibiEvent<this> {
    return this.onChange;
  }

  public interpolate(from: IScale, to: IScale, alpha: number): IScale {
    return {
      x: Linear.INSTANCE.interpolate(from.x, to.x, alpha),
      y: Linear.INSTANCE.interpolate(from.y, to.y, alpha)
    };
  }

  protected assign(value: IScale) {
    this._pixi.scale.set(value.x, value.y);
  }
}