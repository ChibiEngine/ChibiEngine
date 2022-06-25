import Event from "../event/Event";
import { loadResource } from "./ResourcesManager";

/**
 * PB : Si deux resources sont créées pour référencer la même chose :
 *  const sprite1 = new Sprite(new Image("/assets/bunny.png"));
 *  const sprite2 = new Sprite(new Image("/assets/bunny.png"));
 * Résultat: deux Image avec un referenceCount à 1
 * Il faut trouver un moyen de partager cette ressource.
 * 
 * Solution :
 * Se servir de l'appel à this.load() pour renvoyer la ressource déjà chargée. :
 * const ressource1 = this.laod(new Image("/assets/bunny.png"));
 * const ressource2 = this.laod(new Image("/assets/bunny.png"));
 * assert(ressource1 === ressource2);
 */

export default abstract class Resource {
  private referenceCount: number = 0;
  private _path: string;
  private _loaded: boolean = false;
  private _loading: boolean = false;
  private _bytesLoaded: number = 0;
  private _bytesTotal: number = 0;

  public readonly onDestroy: Event<Resource> = new Event();
  public readonly onLoaded: Event<Resource> = new Event();

  protected constructor(path: string) {
    // Normalize path ?
    this._path = path;
  }

  public get path() {
    return this._path;
  }

  public get loading() {
    return this._loading;
  }

  public get loaded() {
    return this._loaded;
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

  public load(): Promise<this> {
    this._loading = true;
    return this._load().then(val => {
      this.onLoaded.trigger(this);
      return val;
    });
  }

  protected abstract _load(): Promise<this>;

  protected abstract destroy(): void;
}
