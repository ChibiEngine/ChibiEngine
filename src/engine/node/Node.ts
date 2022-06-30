import * as PIXI from "pixi.js";
import Position from "../geom/position/Position";
import { LoadablePromise } from "../loader/Loadable";
import Resource from "../resource/Resource";
import INode from "./INode";

/**
 * Noeud simple au sens conteneur PIXI : possède des enfants
 * Toute la hiérarchie d'une scène se base sur ces noeuds
 */
export default class Node extends INode {
  protected internal: PIXI.Container;
  private children: INode[] = [];

  public constructor(position: Position = Position.zero()) {
    super(position);
    this.internal = new PIXI.Container();
  }

  public async create(): Promise<void> {
    // To be overridden
  }

  /**
   * Charge une dépendance (explicit loading)
   * @param dependency
   */
  public load<T extends INode | Resource>(dependency: T): LoadablePromise<T> {
    if(dependency instanceof INode) {
      // TODO: implement
    } else {
      // Déléguer au parent
      this.parent.load(dependency);
    }
    return null;
  }

  /**
   * Ajoute un enfant à ce noeud et charge ses dépendances si nécessaire (just-in-time loading)
   * @param child
   */
  public add<T extends INode>(child: T): LoadablePromise<T> {
    child.parent = this;
    return null;
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
    // Détruire le noeud
    this.internal.destroy();
  }
}
