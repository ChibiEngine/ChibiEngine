import Event from "../event/Event";
import { loadResource } from "./ResourcesManager";

/**
 * PB : Si deux resources sont créées pour référencer la même chose :
 *  const sprite1 = new Sprite(new Image("/assets/bunny.png"));
 *  const sprite2 = new Sprite(new Image("/assets/bunny.png"));
 * Résultat: deux Image avec un referenceCount à 1
 * Il faut trouver un moyen de partager cette ressource.
 */

export default abstract class Resource<T> {
  private referenceCount: number = 0;
  private _path: string;
  private _loaded: boolean = false;
  private _loading: boolean = false;
  private _bytesLoaded: number = 0;
  private _bytesRemaining: number = 0;
  private _bytesTotal: number = 0;

  protected internal: T;

  public readonly onDestroy: Event<Resource<T>> = new Event();
  public readonly onLoaded: Event<Resource<T>> = new Event();

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
    if (this.ref) {
      this.ref.retain();
      return;
    }
    if (!this.loaded) {
      const ref = loadResource(this);
      if (ref !== this) {
        this.ref = ref;
        this.ref.retain();
        return;
      }
    }
    this.referenceCount++;
  }

  public release() {
    this.referenceCount--;
    if (this.referenceCount <= 0) {
      this.destroy();
      this.onDestroy.trigger(this);
    }
  }

  public load(): Promise<void> {
    this._loading = true;
    return this._load();
  }

  protected abstract _load(): Promise<void>;

  public set(internal: T) {
    this._loading = false;
    this._loaded = true;
    this.onLoaded.trigger(this);
  }

  public get(): T {
    return null;
  }

  protected abstract destroy(): void;
}
