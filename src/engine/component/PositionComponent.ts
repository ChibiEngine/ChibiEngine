import Component from "./Component";
import Position from "../geom/position/Position";
import Event from "../event/Event";
import * as PIXI from "pixi.js";
import AbstractGameObject from "../gameobjects/AbstractGameObject";
import Positionable from "../geom/position/Positionable";

export default class PositionComponent extends Component<"positionComponent", AbstractGameObject> implements Positionable {
  readonly componentName: "positionComponent";
  private _position: Position;
  public pixi: PIXI.Container;

  // public https://github.com/microsoft/TypeScript/issues/49709
  public target: AbstractGameObject;

  public constructor(position: Position = Position.zero()) {
    super();
    this._position = position;
  }

  public apply(target: AbstractGameObject): void {
    this.target = target;
    // @ts-ignore TODO: fix this
    this.pixi = target.pixi;
    this.setPosition(this.position);
  }

  public get position(): Position {
    return this._position;
  }

  public setPosition(position: Position): this {
    this._position = position;
    if(!this.pixi) return this;

    this._position.onChange.subscribe((position) => {
      this.pixi.position.set(position.x, position.y);
    });
    this._position.onChange.trigger(this._position);

    return this;
  }

  public get onPositionChange(): Event<Position> {
    return this._position.onChange;
  }

  public get x() {
    return this._position.x;
  }

  public set x(x: number) {
    this._position.x = x;
  }

  public get y() {
    return this._position.y;
  }

  public set y(y: number) {
    this._position.y = y;
  }
}