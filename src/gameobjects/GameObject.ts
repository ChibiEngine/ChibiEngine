import { Container as PixiContainer } from "pixi.js";

import type Container from "./Container";
import Action from "../tween/Action";
import Updatable, {isUpdatable} from "./Updatable";
import {Class, ComponentClass, UnionToIntersection} from "../utils/type_utils";
import AbstractGameObject from "./AbstractGameObject";
import Position from "../component/Position";
import Component from "../component/Component";
import Mixin, {ClassArrayType, ClassArrayTypeOmit, Mixed} from "../mixin/Mixin";
import {ComponentProperties} from "../component/types/ComponentProperty";
import Size from "../component/Size";
import Rotation from "../component/Rotation";

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
export default abstract class GameObject extends AbstractGameObject.With(Position, Size, Rotation) {
  public _parent: Container;
  public abstract pixi: PixiContainer;

  protected created = false;

  public constructor(position: Position = Position.zero()) {
    super();
    this.addComponent(position);
    this.addComponent(new Size());
    this.addComponent(new Rotation());
  }

  public async create(): Promise<void> {
    await super.create();
    const scene = this.scene;
    if (isUpdatable(this) && !this.dontAddToUpdateList) {
      scene.addUpdatable(this as Updatable);
    }
    this.created = true;
    // Init components
    for (const component of this.components) {
      component.apply(this);
    }
  }

  //// LIFE CYCLE ////

  protected abstract _create(): Promise<void>;

  // _update() can be implemented when needed

  protected abstract _destroy(): Promise<void>;

  //////////////////////

  //// ACTIONS ////

  public play(action: Action<this>) {
    this.addComponent(action);
  }

  //////////////////////

  //// UTILS ////

  public get parent(): Container {
    return this._parent;
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
