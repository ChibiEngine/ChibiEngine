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

  private readonly _position: Position;
  public readonly onPositionChange: Event<Position>;

  private readonly _size: Size;
  public readonly onSizeChange: Event<Size>;

  private behaviors: Behavior<this>[] = [];

  protected constructor(position: Position = Position.zero()) {
    super();
    this._position = position;
    this._size = Size.zero();
    this.onPositionChange = this._position.onChange;
    this.onSizeChange = this._size.onChange;
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
    this.position.set(position.x, position.y);
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
    behavior.control(this);
  }

  public removeBehavior(behavior: Behavior<this>) {
    const index = this.behaviors.indexOf(behavior);
    if (index === -1) return false;
    this.behaviors.splice(index, 1);
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
