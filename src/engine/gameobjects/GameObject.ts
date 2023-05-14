import * as PIXI from "pixi.js";
import Position from "../geom/position/Position";

import Size from "../geom/size/Size";

import type Container from "./Container";
import type Scene from "../game/Scene";
import Action from "../tween/Action";
import {isUpdatable} from "./Updatable";
import Rotation from "../geom/rotation/Rotation";
import {Class, ComponentClass, UnionToIntersection} from "../utils/type_utils";
import AbstractGameObject from "./AbstractGameObject";
import PositionComponent from "../component/PositionComponent";
import Component from "../component/Component";
import Mixin, {ClassArrayType, ClassArrayTypeOmit, Mixed} from "../mixin/Mixin";
import {ComponentProperties} from "../component/types/ComponentProperty";
import SizeComponent from "../component/SizeComponent";
import RotationComponent from "../component/RotationComponent";

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
export default abstract class GameObject extends AbstractGameObject.With(PositionComponent, SizeComponent, RotationComponent) {
  public _parent: Container;
  public abstract pixi: PIXI.Container;
  public interpolation = true;

  public constructor(position: Position = Position.zero()) {
    super();
    this.addComponent(new PositionComponent(position));
    this.addComponent(new SizeComponent(Size.zero()));
    this.addComponent(new RotationComponent(Rotation.zero()));
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

  //// ACTIONS ////

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
