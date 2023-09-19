import { Container } from "@pixi/display";

import Event from "../event/Event";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import TransitionableComponent from "./TransitionableComponent";
import IRotation from "../geom/rotation/IRotation";
import {degreesToRadians, radiansToDegrees} from "../math/utils";
import Rotationable from "../geom/rotation/Rotationable";

export default class Rotation extends TransitionableComponent<"rotation", IRotation, AbstractGameObject> implements Rotationable {
  readonly componentName = "rotation";
  public _pixi: Container;

  public target: AbstractGameObject;

  public constructor(radians: number = 0) {
    super({ radians: radians });
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this._pixi = target.pixi;

    target.onLoaded(() => {
      this.set({radians: this.value.radians});
    });

    this.onChange.subscribe((rotation) => {
      // TODO : disable this listener when transition is set?
      this.assign(rotation);
    }, true);

    if(this.updateDt) {
      this.enableTransition();
    }
  }

  public get radians() {
    return this.value.radians;
  }

  public set radians(radians: number) {
    this.set({radians: radians})
  }

  public get degrees() {
    return radiansToDegrees(this.value.radians);
  }

  public set degrees(degrees: number) {
    this.set({radians: degreesToRadians(degrees)});
  }

  public withRotation(rotation: IRotation) {
    this.radians = rotation.radians; // TODO : why does it not work with this.set({radians: rotation.radians}) ?
    return this;
  }

  public static ofRadians(radians: number) {
    return new Rotation(radians);
  }

  public static ofDegrees(degrees: number) {
    return new Rotation(degreesToRadians(degrees));
  }

  public static zero() {
    return new Rotation(0);
  }

  public get onRotationChange(): Event<IRotation> {
    return this.onChange;
  }

  public interpolate(alpha: number): IRotation {
    return {
      radians: this.next.radians * alpha + this.previous.radians * (1 - alpha),
    }
  }

  protected assign(value: IRotation) {
    this._pixi.rotation = value.radians;
  }
}