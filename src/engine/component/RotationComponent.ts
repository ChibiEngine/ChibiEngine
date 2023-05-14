import Component from "./Component";
import Event from "../event/Event";
import * as PIXI from "pixi.js";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import Rotation from "../geom/rotation/Rotation";

export default class RotationComponent extends Component<"rotationComponent", AbstractGameObject> {
  readonly componentName: "rotationComponent";
  private _rotation: Rotation;
  public pixi: PIXI.Container;

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;

  public constructor(rotation: Rotation = Rotation.zero()) {
    super();
    this._rotation = rotation;
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this.pixi = target.pixi;
    this.setRotation(this.rotation);
  }

  public get rotation() {
    return this._rotation;
  }

  public setRotation(rotation: Rotation) {
    this._rotation = rotation;
    if(!this.pixi) return this;

    this._rotation.onChange.subscribe((rotation) => {
      this.pixi.rotation = rotation.radians;
    });
    this._rotation.onChange.trigger(this._rotation);
    return this;
  }

  public get onRotationChange(): Event<Rotation> {
    return this._rotation.onChange;
  }
}