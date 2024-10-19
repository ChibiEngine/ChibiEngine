import { Container as PixiContainer } from "pixi.js";

import type Container from "./Container";
import Action from "../tween/Action";
import {Updatable, isUpdatable} from "./Updatable";
import {Class} from "../utils/Types";
import AbstractGameObject from "./AbstractGameObject";
import Position from "../component/Position";
import Scale from "../component/Scale";
import Rotation from "../component/Rotation";
import Scene from "../game/Scene";
import {ChibiEvent} from "../event/ChibiEvent";

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

  public onAddedToScene: ChibiEvent<this> = new ChibiEvent();

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
    this.createStart();

    const componentApplyPromises: Promise<void>[] = [];

    await this._create();

    for (const component of this.components) {
      if(!component.immediateApply) {
        componentApplyPromises.push(component.apply(this));
      }
    }

    this.componentsApplied = true;

    this.createEnd();
    /* Need to be after components apply to avoid cyclic awaiting
    E.g. Scene (+ PhysicsWorld) waits for all dependencies to be loaded
    But these dependencies have PhysicsBody which waits for the Scene PhysicsWorld to be applied (which would never happen if apply was called after onDependenciesLoaded)
     */
    await this.onDependenciesLoaded.asPromise();

    await Promise.all(componentApplyPromises);

    this.onLoaded.trigger(this);
  }

  public addToScene(scene: Scene) {
    this.addedToScene = true;
    this.scene = scene;
    if (isUpdatable(this)) {
      scene.addUpdatable(this as Updatable);
    }

    for(const component of this.updatableComponentsToAdd) {
      this.scene.addUpdatable(component);
    }

    this.updatableComponentsToAdd.length = 0;
    this.onAddedToScene.trigger(this);
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
