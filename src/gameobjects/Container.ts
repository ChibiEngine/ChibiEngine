import { Container as PixiContainer } from "pixi.js";

import GameObject from "./GameObject";
import Position from "../component/Position";
import type Scene from "../game/Scene";
import Loadable from "../resource/Loadable";

/**
 * Noeud simple au sens conteneur PIXI : possède des enfants
 * Toute la hiérarchie d'une scène se base sur ces noeuds
 */
// TODO : renommer en Container?
export default class Container extends GameObject {
  public readonly pixi: PixiContainer;
  public readonly children: GameObject[] = [];

  private _destroyed: boolean = false;

  public constructor(position: Position = Position.zero()) {
    super(position);
    this.pixi = new PixiContainer();
  }

  /**
   * To override
   */
  protected async _create(): Promise<void> {
    // To override
  }

  public set scene(scene: Scene) {
    super.scene = scene;
    for (const child of this.children) {
      child.scene = scene;
    }
  }

  public get scene(): Scene {
    return super.scene;
  }

  /**
   * Ajoute un enfant à ce noeud et charge ses dépendances si nécessaire (just-in-time loading)
   * This method is asynchronous and resolves when the dependency is loaded.
   * @param child
   * @param id?
   */
  public add<T extends GameObject>(child: T, id?: string): T & PromiseLike<T> {
    if (this._destroyed) throw new Error("Container has been destroyed");
    if (child._parent) throw new Error("Child already has a parent");
    if(id !== undefined) child.id = id;
    child._parent = this;
    if(this.scene) child.scene = this.scene;

    let index = this.children.length;

    this.children.push(child);

    // pixi object can be present before object is loaded
    // Example: when creating a scene, the container is immediately available while populating it (create) can take time
    if (child.pixi) {
      if(index <= this.pixi.children.length) {
        this.pixi.addChildAt(child.pixi, index);
      } else {
        this.pixi.addChild(child.pixi);
      }
    } else {
      child.onLoaded.subscribeOnce(node => {
        if(index <= this.pixi.children.length) {
          this.pixi.addChildAt(node.pixi, index);
        } else {
          this.pixi.addChild(node.pixi);
        }
      });
    }

    // after so onDependencyLoaded is called after the pixi objects have been added
    this.load(child);

    if(this.addedToScene) {
      child.onLoaded.subscribeOnce(() => {
          child.addToScene(this.scene);
      });
    }

    // @ts-ignore
    return child;
  }

  public addToScene(scene: Scene) {
    this.scene = scene;
    this.addedToScene = true;
    for(const child of this.children) {
      if(child.addedToScene) continue; // Already added to scene, no need to trigger the event

      child.addToScene(scene);
    }
    super.addToScene(scene);
  }

  /**
   * Supprime un enfant de ce noeud et apppelle destroy() sur cet enfant pour nettoyer
   * @param child
   * @returns true si l'enfant était présent
   */
  public remove(child: GameObject): boolean {
    const index = this.children.indexOf(child);
    if (index === -1) return false;
    this.pixi.removeChild(child.pixi);
    this.children.splice(index, 1)[0].destroy();
    child._parent = null;
    return true;
  }

  public async _destroy(): Promise<void> {
    this._destroyed = true;
    this.pixi.destroy();
  }

  protected willDestroyDependency(dependency: Loadable) {
    if(dependency instanceof GameObject) {
      this.pixi.removeChild(dependency.pixi);
      dependency._parent = null;
    }
  }
}
