import Event from "../event/Event";
import Loadable from "../loader/Loadable";
import HttpRequest from "../loader/HttpRequest";

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
  private readonly _path: string;

  public readonly onDestroy: Event<this> = new Event();

  protected constructor(path: string) {
    super();
    // Normalize path ?
    this._path = path;
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

  public load() {
    this._isLoading = true;
    this.create().then(() => {
      this._isLoading = false;
      this._isLoaded = true;
      this.onLoaded.trigger(this);
      return this;
    });
  }

  protected async request(url: string): Promise<Blob> {
    const request = new HttpRequest(url);
    this.loaderInfo.add(request.loaderInfo);
    await request.create();
    return request.response;
  }

  protected abstract create(): Promise<void>;

  protected abstract destroy(): void;
}
