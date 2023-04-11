import * as PIXI from "pixi.js";
import Event from "../event/Event";
import Position from "../geom/position/Position";

import Positionable from "../geom/position/Positionable";
import Size from "../geom/size/Size";
import Sizeable from "../geom/size/Sizeable";
import center from "./positioning/center";

import type Container from "./Container";
import type Scene from "../game/Scene";
import Action from "../tween/Action";
import {isUpdatable, VariableUpdatable} from "./Updatable";
import assignSize from "../geom/size/assignSize";
import Rotation from "../geom/rotation/Rotation";
import assignRotation from "../geom/rotation/assignRotation";
import {Class, ComponentClass, UnionToIntersection} from "../utils/type_utils";
import AbstractGameObject from "./AbstractGameObject";
import PositionComponent from "../component/PositionComponent";
import Component from "../component/Component";
import Mixin, {ClassArrayType, ClassArrayTypeOmit, Mixed} from "../mixin/Mixin";
import {ComponentProperties} from "../component/types/ComponentProperty";

// Inspired by https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/d3/d82/classcocos2d_1_1_node.html

/**
 * Noeud abstrait implémenté par les wrapper d'objets Pixi
 * Ne contient pas d'enfant car je trouve plus logique d'avoir une hiérarchie de la forme :
 * - Node
 *   - Sprite
 *   - Text
 * Pour moi un Sprite doit être une feuille de l'arbre.
 *
 * plutôt que :
 * - Sprite
 *   - Text
 */
export default abstract class GameObject extends AbstractGameObject.With(PositionComponent) implements Positionable, Sizeable, VariableUpdatable {
  public _parent: Container;

  public abstract internal: PIXI.Container;

  private _position: Position;
  private _size: Size;
  private _rotation: Rotation;

  public interpolation = true;

  public constructor(position: Position = Position.zero()) {
    super();
    this.setPosition(position);
    this.setSize(Size.zero());
    this.setRotation(Rotation.zero());
  }

  public async create(): Promise<void> {
    await super.create();
    const scene = this.scene;
    if (isUpdatable(this)) {
      scene.addUpdatable(this);
    }
  }

  //// LIFE CYCLE ////

  protected abstract _create(): Promise<void>;

  // _update() can be implemented when needed

  protected abstract _destroy(): Promise<void>;

  //////////////////////

  //// POSITION ////

  public get position() {
    return this._position;
  }

  public setPosition(position: Position): this {
    this._position = position;

    if(this.internal)
      this.internal.position = position;

    return this;
  }

  public variableUpdate(dt: number): void {
    if(!this.interpolation) return;
    const vec2 = this.position.interpolateDt(dt);
    this.internal.position.set(vec2.x, vec2.y);
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

  public get center() {
    return center(this);
  }

  //////////////////////

  //// SIZE ////

  public get size() {
    return this._size;
  }

  public setSize(size: Size): this {
    this._size = size;
    assignSize(this.internal, this.size);
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

  //////////////////////

  //// ROTATION ////

  public get rotation() {
    return this._rotation;
  }

  public setRotation(rotation: Rotation) {
    this._rotation = rotation;
    assignRotation(this.internal, this.rotation);
  }

  public get onRotationChange(): Event<Rotation> {
    return this._rotation.onChange;
  }

  //////////////////////

  //// COMPONENTS ////

  public play(action: Action<this>) {
    //@ts-ignore
    this.addComponent(action, false);
  }

  //////////////////////

  //// UTILS ////

  public get parent(): Container {
    return this._parent;
  }

  public get scene(): Scene {
    return this.parent.scene;
  }

  public getParent<T extends GameObject>(type: Class<T>): T {
    if (this.parent instanceof type) {
      return this.parent as T;
    } else {
      return this.parent.getParent(type);
    }
  }

  public static With<T extends abstract new (...args: any) => any, A extends Array<Class<Component<string, InstanceType<T> & UnionToIntersection<ClassArrayType<A>>>>>>(this: T, ...classes: A):
      ComponentClass<T, InstanceType<T> & UnionToIntersection<ClassArrayTypeOmit<A, "componentName">> & ComponentProperties<A> & Mixed> & {With: typeof GameObject.With} {
    return Mixin(this, ...classes) as any;
  }
}
