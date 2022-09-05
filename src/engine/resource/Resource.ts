import Event from "../event/Event";
import Loadable from "../loader/Loadable";

/**
 * PB : Si deux resources sont créées pour référencer la même chose :
 *  const sprite1 = new Sprite(new Image("/assets/bunny.png"));
 *  const sprite2 = new Sprite(new Image("/assets/bunny.png"));
 * Résultat: deux Image avec un referenceCount à 1
 * Il faut trouver un moyen de partager cette ressource.
 *
 * Solution :
 * Se servir de l'appel à this.load() pour renvoyer la ressource déjà chargée. :
 * const ressource1 = this.load(new Image("/assets/bunny.png"));
 * const ressource2 = this.load(new Image("/assets/bunny.png"));
 * assert(ressource1 === ressource2);
 */

export default abstract class Resource extends Loadable {
  private referenceCount: number = 0;
  public readonly id: string;
  private readonly _path: string;

  public parent: Loadable;

  public readonly onDestroy: Event<this> = new Event();

  protected constructor(path: string, ...args: any[]) {
    super();
    // Normalize path ?
    this._path = path;
    this.id = this.constructor.name + "_" + path + "_" + JSON.stringify(args);
  }

  public get path() {
    return this._path;
  }

  public retain() {
    this.referenceCount++;
  }

  public release() {
    this.referenceCount--;
    if (this.referenceCount <= 0) {
      this.destroy();
      this.onDestroy.trigger(this);
    }
  }

  protected abstract create(): Promise<void>;

  protected abstract destroy(): void;
}
