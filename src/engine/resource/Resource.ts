import Event from "../event/Event";
import EventPromise, { makePromise } from "../event/EventPromise";
import Loadable from "../loader/Loadable";
import LoaderInfo from "../loader/LoaderInfo";

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

export default abstract class Resource extends Loadable {
  private referenceCount: number = 0;
  private _path: string;

  public readonly loaderInfo = new LoaderInfo();

  public readonly onDestroy: Event<this> = new Event();
  public readonly onLoaded: EventPromise<this> = makePromise(new Event<this>());
  public readonly onProgress: Event<LoaderInfo> = this.loaderInfo.onProgress;

  protected constructor(path: string) {
    super();
    // Normalize path ?
    this._path = path;
  }

  public get path() {
    return this._path;
  }

  public get bytesLoaded() {
    return this.loaderInfo.bytesLoaded;
  }

  public get bytesTotal() {
    return this.loaderInfo.bytesTotal;
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
    return this.create().then(() => {
      this._loading = false;
      this._loaded = true;
      this.onLoaded.trigger(this);
      return this;
    });
  }

  protected abstract create(): Promise<void>;

  protected abstract destroy(): void;
}
