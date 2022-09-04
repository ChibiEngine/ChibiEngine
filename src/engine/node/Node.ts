import * as PIXI from "pixi.js";
import Position from "../geom/position/Position";
import Resource from "../resource/Resource";
import INode from "./INode";

/**
 * Noeud simple au sens conteneur PIXI : possède des enfants
 * Toute la hiérarchie d'une scène se base sur ces noeuds
 */
export default class Node extends INode {
  public readonly _internal: PIXI.Container;
  private children: INode[] = [];

  public constructor(position: Position = Position.zero()) {
    super(position);
    this._internal = new PIXI.Container();
  }

  /**
   * Sans effet.
   * A redéfinir dans les sous-classes.
   */
  public async create(): Promise<void> { }

  /**
   * Charge une dépendance (explicit loading)
   * @param dependency
   */
  public load<T extends INode | Resource>(dependency: T): T {
    if(dependency instanceof INode) {
      dependency.parent = this;
      this.children.push(dependency);
      // TODO: dependency.waitForCreation.then(...)   waitForCreation calls create, waits for it to finish and waits for each child to be loaded
      dependency.create().then(() => dependency.onLoaded.trigger(dependency));
      return dependency;
    } else {
      // Déléguer au parent
      // TODO: ce cast est bizarre
      return super.load(dependency) as T;
    }
  }

  /**
   * Ajoute un enfant à ce noeud et charge ses dépendances si nécessaire (just-in-time loading)
   * @param child
   */
  public add<T extends INode>(child: T): T {
    let loadPromise = this.load(child).loaded;
    loadPromise.then(node => {
      this._internal.addChild(node.internal)
    });
    return child;
  }

  /**
   * Supprime un enfant de ce noeud et apppelle destroy() sur cet enfant pour nettoyer
   * @param child
   * @returns true si l'enfant était présent
   */
  public remove(child: INode): boolean {
    const index = this.children.indexOf(child);
    if (index === -1) return false;
    child.parent = null;
    this.children.splice(index, 1)[0].destroy();
    return true;
  }

  /**
   * Détruit le noeud et ses enfants, libère les ressources
   */
  public destroy() {
    // Détruire les enfants
    for (const child of this.children) {
      child.destroy();
    }
    // Détruire le noeud interne
    this._internal.destroy();
  }
}
