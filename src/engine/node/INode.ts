// https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/d3/d82/classcocos2d_1_1_node.html

import * as PIXI from "pixi.js";
import Event from "../event/Event";
import Position from "../geom/position/Position";

import Positionable from "../geom/position/Positionable";
import Size from "../geom/size/Size";
import Sizeable from "../geom/size/Sizeable";
import center from "./positioning/center";

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
export default abstract class INode implements Positionable, Sizeable {
  protected abstract readonly internal: PIXI.Container;

  private readonly _position: Position;
  public readonly onPositionChange: Event<Position>;

  private readonly _size: Size;
  public readonly onSizeChange: Event<Size>;

  public constructor(position: Position = Position.zero()) {
    this._position = position;
    this._size = Size.zero();
    this.onPositionChange = this._position.onChange;
    this.onSizeChange = this._size.onChange;
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

  /**
   * Détruit le noeud et libère ses ressources
   */
  public abstract destroy(): void;
}
