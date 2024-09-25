import { Container as PixiContainer } from "pixi.js";

import type Container from "./Container";
import Action from "../tween/Action";
import {Updatable, isUpdatable} from "./Updatable";
import {Class} from "../utils/Types";
import AbstractGameObject from "./AbstractGameObject";
import Position from "../component/Position";
import Scale from "../component/Scale";
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
export default abstract class GameObject extends AbstractGameObject.With(Position, Scale, Rotation) {
  public id?: string;

  public _parent: Container;
  public abstract pixi: PixiContainer;

  // TODO : reuse parent _isCreated attribute
  protected created = false;

  public constructor(
      position: Position = Position.zero(),
      scale: Scale = new Scale(),
      rotation: Rotation = new Rotation(),
  ) {
    super();
    this.addComponent(position);
    this.addComponent(scale);
    this.addComponent(rotation);
  }

  public async create(): Promise<void> {
    this.loadingStart();

    // Set first to be sure other components are applied first
    // TODO : should only set _isCreated to true when all components are applied ?
    this.whenLoaded(() => {
      for (const component of this.components) {
        component.apply(this);
      }
    });
    await this._create();

    const scene = this.scene;
    if (isUpdatable(this) && !this.dontAddToUpdateList) {
      scene.addUpdatable(this as Updatable);
    }
    this.created = true;

    this.loadingEnd();
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

  public static With = AbstractGameObject.With;

  public async destroy(): Promise<void> {
    if (this.scene) {
      for(const component of this.components) {
        this.removeComponent(component);
      }
      if(isUpdatable(this)) {
        this.scene.removeUpdatable(this as Updatable);
      }
    }
    return super.destroy();
  }
}
