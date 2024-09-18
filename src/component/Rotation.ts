import {Container} from "pixi.js";

import {Event} from "../event/Event";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import TransitionableComponent from "./TransitionableComponent";
import IRotation from "../geom/rotation/IRotation";
import {degreesToRadians, radiansToDegrees} from "../math/utils";
import Rotationable from "../geom/rotation/Rotationable";
import Linear from "../math/easing/Linear";

export default class Rotation extends TransitionableComponent<"rotation", IRotation, AbstractGameObject> implements Rotationable {
  readonly componentName = "rotation";
  public _pixi: Container;

  public target: AbstractGameObject;

  public constructor(radians: number = 0) {
    super({radians: radians});
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this._pixi = target.pixi;

    this.set(this.current);

    this.onChange.subscribe((position) => {
      // TODO : disable this listener when transition is set?
      this.assign(position);
    }).triggerNowIfValueExists();

    if (this.transitionMillis) {
      this.enableTransition();
    }
  }

  public get radians() {
    return this.current.radians;
  }

  public set radians(radians: number) {
    this.set({radians: radians})
  }

  public get degrees() {
    return radiansToDegrees(this.current.radians);
  }

  public set degrees(degrees: number) {
    this.set({radians: degreesToRadians(degrees)});
  }

  public set(value: IRotation) {
    super.set({radians: value.radians, degrees: radiansToDegrees(value.radians)});
  }

  public setRotation(rotation: IRotation) {
    // Note: this was the gameobject here.
    // this.radians = rotation.radians; // TODO : why does it not work with this.set({radians: rotation.radians}) ? => because it calls set of Position!
    this.set(rotation);
    return this.gameobject;
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

  public interpolate(from: IRotation, to: IRotation, alpha: number): IRotation {
    return {
      radians: Linear.INSTANCE.interpolate(from.radians, to.radians, alpha)
    }
  }

  protected assign(value: IRotation) {
    this._pixi.rotation = value.radians;
  }
}