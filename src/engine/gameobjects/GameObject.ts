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
import {assignPosition} from "../geom/utils";
import Action from "../tween/Action";
import {assertTypesMatch, Class, ClassFull} from "../utils/Typed";
import {isUpdatable} from "./Updatable";

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
// TODO: Renommer AbstractNode en Leaf? ou GameObject?
export default abstract class GameObject extends Loadable implements Positionable, Sizeable {
  type = "node";

  public _parent: Container;

  protected abstract _internal: PIXI.Container;

  private _position: Position;
  public get onPositionChange(): Event<Position> {
    return this._position.onChange;
  }

  private readonly _size: Size;
  public get onSizeChange(): Event<Size> {
    return this._size.onChange;
  }

  private components: Component<GameObject>[] = [];

  protected constructor(position: Position = Position.zero()) {
    super();
    this.setPosition(position);
    this._size = Size.zero();
  }

  public get parent(): Container {
    return this._parent;
  }

  // TODO : ajouter Skew

  public async create(): Promise<void> {
    await super.create();
    const scene = this.scene;
    if("update" in this && this !== scene) {
      scene.addUpdatable(this);
    }
  }

  protected abstract _create(): Promise<void>;

  public get internal(): PIXI.Container {
    return this._internal;
  }

  public get position() {
    return this._position;
  }

  public setPosition(position: Position): this {
    this._position = position;
    assignPosition(this._internal, this.position);
    return this;
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

  public get size() {
    return this._size;
  }

  public setSize(size: Size): this {
    this._size.set(size.width, size.height);
    return this;
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

  public get center() {
    return center(this);
  }

  public addComponent<T extends Component<GameObject>>(component: T): T {
    this.components.push(component);
    component.apply(this);
    if(isUpdatable(component)) {
      this.scene.addUpdatable(component);
    }
    return component;
  }

  public removeComponent(component: Component<GameObject>) {
    const index = this.components.indexOf(component);
    if (index === -1) return false;
    this.components.splice(index, 1);
    if(isUpdatable(component)) {
      this.scene.removeUpdatable(component);
    }
  }

  public getComponent<T extends Component<GameObject>>(type: Class<T>): T {
    for (const component of this.components) {
      if (component instanceof type) {
        return component as T;
      }
    }
    return null;
  }

  public play<T extends GameObject>(action: Action<GameObject>) {
    assertTypesMatch(this, action);
    this.addComponent(action);
  }
  
  public getParent<T extends GameObject>(type: ClassFull<T>): T {
    if(this.parent instanceof type) {
      return this.parent as T;
    } else{
      return this.parent.getParent(type);
    }
  }

  public get scene(): Scene {
    return this.parent.scene;
  }
}
