import * as PIXI from "pixi.js";
import Position from "../geom/position/Position";
import INode from "./INode";
import {assignPosition} from "../geom/utils";

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
    assignPosition(this._internal, position);
  }

  /**
   * Sans effet.
   * A redéfinir dans les sous-classes.
   */
  protected async _create(): Promise<void> {
  }

  /**
   * Ajoute un enfant à ce noeud et charge ses dépendances si nécessaire (just-in-time loading)
   * @param child
   */
  public add<T extends INode>(child: T): T {
    this.children.push(child);
    this.load(child);

    if (child.internal) {
      this._internal.addChild(child.internal);
    } else {
      child.loaded.then(node => {
        this._internal.addChild(node.internal)
      });
    }

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
    child._parent = null;
    this.children.splice(index, 1)[0].destroy();
    return true;
  }

  public async _destroy(): Promise<void> {
    this._internal.destroy();
  }
}
