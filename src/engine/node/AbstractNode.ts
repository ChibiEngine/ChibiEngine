import * as PIXI from "pixi.js";
import Behavior from "../behavior/Behavior";
import Event from "../event/Event";
import Position from "../geom/position/Position";

import Positionable from "../geom/position/Positionable";
import Size from "../geom/size/Size";
import Sizeable from "../geom/size/Sizeable";
import Loadable from "../loader/Loadable";
import center from "./positioning/center";

import type Node from "./Node";
import type Scene from "../game/Scene";
import {assignPosition} from "../geom/utils";
import Action from "../tween/Action";

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
// TODO: Renommer INode en Leaf?
export default abstract class AbstractNode extends Loadable implements Positionable, Sizeable {
  type = "node";

  public _parent: Node;

  protected abstract _internal: PIXI.Container;

  private _position: Position;
  public get onPositionChange(): Event<Position> {
    return this._position.onChange;
  }

  private readonly _size: Size;
  public get onSizeChange(): Event<Size> {
    return this._size.onChange;
  }

  private behaviors: Behavior<this>[] = [];

  protected constructor(position: Position = Position.zero()) {
    super();
    this.setPosition(position);
    this._size = Size.zero();
  }

  public get parent(): Node {
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

  public addBehavior(behavior: Behavior<this>) {
    this.behaviors.push(behavior);
    behavior.setTarget(this);
    this.scene.addUpdatable(behavior);
  }

  public play<T extends AbstractNode>(action: Action<T>) {
    // TODO : ugly but don't know how to do better
    // NOTE : doesn't prevent calling a specific action on a node that doesn't support it e.g. calling Tint on a Node
    this.addBehavior(action as any as Behavior<this>);
    action.run(this as any as T);
  }

  public removeBehavior(behavior: Behavior<this>) {
    const index = this.behaviors.indexOf(behavior);
    if (index === -1) return false;
    this.behaviors.splice(index, 1);
    this.scene.removeUpdatable(behavior);
  }

  public getParentBehavior<T extends Behavior<any>>(type: typeof Behavior): T {
    // TODO: implement
    return null as T;
  }
  
  public getParent<T extends AbstractNode>(type: typeof AbstractNode): T {
    // TODO: implement
    return null as T;
  }

  public get scene(): Scene {
    return this.parent.scene;
  }
}
