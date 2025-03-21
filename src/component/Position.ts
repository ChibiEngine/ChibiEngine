import { Container } from "pixi.js";

import {ChibiEvent} from "../event/ChibiEvent";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import Positionable from "../geom/position/Positionable";
import TransitionableComponent from "./TransitionableComponent";
import IPosition from "../geom/position/IPosition";
import Linear from "../math/easing/Linear";

export default class Position extends TransitionableComponent<"position", IPosition, AbstractGameObject> implements Positionable {
  readonly componentName = "position";

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;
  public _pixi: Container;

  public constructor(x: number = 0, y: number = x) {
    super({ x, y});
  }

  public async apply(target: AbstractGameObject) {
    this.target = target;
    // @ts-ignore
    this._pixi = target.pixi;

    this.onChange.subscribe((position) => {
      // TODO : disable this listener when transition is set?
      this.assign(position);
    });

    this.set(this.current);

    if(this.transitionMillis) {
      this.enableTransition();
    }
  }

  public get onPositionChange(): ChibiEvent<[IPosition]> {
    return this.onChange;
  }

  public static zero() {
    return new Position(0, 0);
  }

  public setPosition(position: IPosition|number, y: number = 0) {
    if(typeof position === "number") {
      this.set({ x: position, y });
    } else {
      this.set(position);
    }
    return this.gameobject;
  }

  public get x() {
    return this.current.x;
  }

  public get y() {
    return this.current.y;
  }

  public set x(x: number) {
    this.set(x, this.y);
  }

  public set y(y: number) {
    this.set(this.x, y);
  }

  public set(x: number|IPosition, y: number = 0) {
    if(typeof x === "number") {
      super.set({ x, y });
    } else {
      super.set({x: x.x, y: x.y});
    }
  }

  public setX(x: number) {
    this.x = x;
    return this;
  }

  public setY(y: number) {
    this.y = y;
    return this;
  }

  public addX(number: number): this {
    this.set(this.x + number, this.y);
    return this;
  }

  public addY(number: number): this {
    this.set(this.x, this.y + number);
    return this;
  }

  public clone() {
    return new Position(this.x, this.y);
  }

  public plusY(dy: number): Position {
    return new Position(this.x, this.y + dy);
  }

  public plusX(dx: number): Position {
    return new Position(this.x + dx, this.y);
  }

  public interpolate(from: IPosition, to: IPosition, alpha: number): IPosition {
    return {
      x: Linear.INSTANCE.interpolate(from.x, to.x, alpha),
      y: Linear.INSTANCE.interpolate(from.y, to.y, alpha)
    }
  }

  protected assign(value: IPosition) {
    this._pixi.position.set(value.x, value.y);
  }
}