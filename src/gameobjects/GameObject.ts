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

    // Set first to be sure other components are applied first
    // TODO : should only set _isCreated to true when all components are applied ?

    const componentApplyPromises: Promise<void>[] = [];

    await this._create();

    for (const component of this.components) {
      if(!component.immediateApply) {
        componentApplyPromises.push(component.apply(this)); // TODO: differentiate apply vs postApply (ran after dependencies are loaded)?
                                                            // Or let the user do the await he need in apply?
      }
    }

    console.log(this.indent + this.constructor.name, "await onDependenciesLoaded()", this.dependencies);
    await this.onDependenciesLoaded.asPromise();
    console.log(this.indent + this.constructor.name, "onDependenciesLoaded()");
    // Pb: some dependencies may not be loaded yet when applying components
    await Promise.all(componentApplyPromises);

    this.createEnd();

    // TODO: pb, updatable should be added when the object is added to the scene, not when it's being loaded + components (eg. PhysicsBody) should not be applied
    // What if the object being loaded do .add calls?
    // Need separation between loading and adding to scene
    // Each object has an added flag that is equals to parent's added flag
    // Only scenes have added=true by default
    // When the object is added, added is set to parent's added
    // If added is true, calls onAdded which will add updatables and apply components
    // When the object is added, if it has parents, its onAdded method is called
    // onAdded
    // But some components may need to be applied before the object is added. apply vs postApply
    // addedToScene == not orphan
    /*
    scene (addedToScene = true)


    const container = this.load(new class extends Container { // addedToScene = false
      public async create() {
        const sprite = this.add(new Sprite(...)); // addedToScene = false
          public add(object) {
            object.parent = this;
            object.addedToScene = this.addedToScene;
            if(!object.created) {
              object.create();
            }
            if(object.addedToScene) {
              object.addToScene();
            }
          }
          public addToScene(scene: Scene) {
            this.scene = scene;
            for(const child of this.children) {
              child.addToScene(scene);
            }
            for(const component of this.components) {
              component.postApply(scene);
            }
            // Add updatables...
          }
      }
    }());

    Lifecycle :

    create
      - _create
      - apply
    addToScene
      - triggers onAddedToScene event
      - update

    Or better than postApply:

    public async apply(target: GameObject) {
      // do stuff

      target.onAddedToScene(() => {
        // do post apply stuff
      });
    }

     */
    const scene = this.scene;
    if (isUpdatable(this)) {
      scene.addUpdatable(this as Updatable);
    }

    for(const component of this.updatableComponentsToAdd) {
      this.scene.addUpdatable(component);
    }

    this.updatableComponentsToAdd.length = 0;
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
