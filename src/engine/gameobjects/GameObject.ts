import * as PIXI from "pixi.js";
import Component from "../component/Component";
import Event from "../event/Event";
import Position from "../geom/position/Position";

import Positionable from "../geom/position/Positionable";
import Size from "../geom/size/Size";
import Sizeable from "../geom/size/Sizeable";
import Loadable from "../loader/Loadable";
import center from "./positioning/center";

import type Container from "./Container";
import type Scene from "../game/Scene";
import Action from "../tween/Action";
import {assertTypesMatch, Class, ClassFull, ComponentClass, NoInfer} from "../utils/Typed";
import {isUpdatable, VariableUpdatable} from "./Updatable";
import assignPosition from "../geom/position/assignPosition";
import assignSize from "../geom/size/assignSize";
import Rotation from "../geom/rotation/Rotation";
import assignRotation from "../geom/rotation/assignRotation";
import assignComponent from "./operations/assignComponent";
import ComponentProperty from "../component/types/ComponentProperty";
import Mixin, {Mixed} from "../mixin/Mixin";

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
export default abstract class GameObject extends Loadable implements Positionable, Sizeable, VariableUpdatable {
  type = "gameobject";

  public _parent: Container;

  protected abstract _internal: PIXI.Container;

  private _position: Position;
  private _size: Size;
  private _rotation: Rotation;

  public interpolation = true;

  private components: Component<string, any>[] = [];

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

  public get internal(): PIXI.Container {
    return this._internal;
  }

  //// POSITION ////

  public get position() {
    return this._position;
  }

  public setPosition(position: Position): this {
    this._position = position;
    assignPosition(this._internal, this.position);
    this.onPositionChange(() => {
      console.log("position changed");
    })
    return this;
  }

  public variableUpdate(dt: number): void {
    if(!this.interpolation) return;
    const vec2 = this.position.interpolateDt(dt);
    this._internal.position.set(vec2.x, vec2.y);
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
    assignSize(this._internal, this.size);
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
    assignRotation(this._internal, this.rotation);
  }

  public get onRotationChange(): Event<Rotation> {
    return this._rotation.onChange;
  }

  //////////////////////

  //// COMPONENTS ////

  public addComponent<C extends Component<string, this>>(component: C, assign: boolean = true) {
    this.components.push(component);
    component.apply(this);
    if (isUpdatable(component)) {
      this.scene.addUpdatable(component);
    }
    return assign && assignComponent(this, component);
  }

  public removeComponent(component: Component<string, this>) {
    const index = this.components.indexOf(component);
    if (index === -1) return false;
    this.components.splice(index, 1);
    if (isUpdatable(component)) {
      this.scene.removeUpdatable(component);
    }
  }

  public getComponent<T extends Component<string>>(type: Class<T>): T {
    for (const component of this.components) {
      if (component instanceof type) {
        return component as T;
      }
    }
    return null;
  }

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

  public getParent<T extends GameObject>(type: ClassFull<T>): T {
    if (this.parent instanceof type) {
      return this.parent as T;
    } else {
      return this.parent.getParent(type);
    }
  }

  //////////////////////

  public static With<T extends abstract new (...args: any) => any, A extends Component<string, InstanceType<T>>, B extends Component<string, InstanceType<T>>|unknown = unknown, C extends Component<string, InstanceType<T>>|unknown = unknown, D extends Component<string, InstanceType<T>>|unknown = unknown, E extends Component<string, InstanceType<T>>|unknown = unknown, F extends Component<string, InstanceType<T>>|unknown = unknown, G extends Component<string, InstanceType<T>>|unknown = unknown, H extends Component<string, InstanceType<T>>|unknown = unknown, I extends Component<string, InstanceType<T>>|unknown = unknown, J extends Component<string, InstanceType<T>>|unknown = unknown>(this: T, a: ClassFull<A>, b?: ClassFull<B>, c?: ClassFull<C>, d?: ClassFull<D>, e?: ClassFull<E>, f?: ClassFull<F>, g?: ClassFull<G>, h?: ClassFull<H>, i?: ClassFull<I>, j?: ClassFull<J>):
      ComponentClass<T, InstanceType<T> & A & B & C & D & E & F & G & H & I & J & Mixed
          & ComponentProperty<A> & ComponentProperty<B> & ComponentProperty<C> & ComponentProperty<D> & ComponentProperty<E> & ComponentProperty<F> & ComponentProperty<G> & ComponentProperty<H> & ComponentProperty<I> & ComponentProperty<J>> & { With: typeof GameObject.With } {
    return Mixin(this, a, b, c, d, e, f, g, h, i, j) as any;
  }
}
