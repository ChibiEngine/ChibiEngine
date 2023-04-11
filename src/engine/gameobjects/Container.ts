import * as PIXI from "pixi.js";
import Position from "../geom/position/Position";
import GameObject from "./GameObject";

/**
 * Noeud simple au sens conteneur PIXI : possède des enfants
 * Toute la hiérarchie d'une scène se base sur ces noeuds
 */
// TODO : renommer en Container?
export default class Container extends GameObject {
  public readonly _internal: PIXI.Container;
  private children: GameObject[] = [];

  public constructor(position: Position = Position.zero()) {
    super(position);
    this._internal = new PIXI.Container();
    this.setPosition(position);
  }

  /**
   * Sans effet.
   * A redéfinir dans les sous-classes.
   */
  protected async _create(): Promise<void> {
  }

  /**
   * Ajoute un enfant à ce noeud et charge ses dépendances si nécessaire (just-in-time loading)
   * This method is asynchronous and resolves when the dependency is loaded.
   * @param child
   */
  public add<T extends GameObject>(child: T): T & PromiseLike<T>{
    if (child._parent) throw new Error("Child already has a parent");
    child._parent = this;

    this.children.push(child);
    this.load(child);

    if (child.internal) {
      this._internal.addChild(child.internal);
    } else {
      child.onLoaded.subscribeOnce(node => {
        this._internal.addChild(node.internal)
      });
    }

    // @ts-ignore
    return child;
  }

  /**
   * Supprime un enfant de ce noeud et apppelle destroy() sur cet enfant pour nettoyer
   * @param child
   * @returns true si l'enfant était présent
   */
  public remove(child: GameObject): boolean {
    const index = this.children.indexOf(child);
    if (index === -1) return false;
    child._parent = null;
    this.children.splice(index, 1)[0].destroy();
    return true;
  }

  public async _destroy(): Promise<void> {
    this._internal.destroy();
  }
}
