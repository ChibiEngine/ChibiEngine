import {ChibiEvent} from "../event/ChibiEvent";
import Loadable from "./Loadable";
import Logger from "../utils/Logger";
import debug = Logger.debug;
import ReferenceCount from "./ReferenceCount";

export default abstract class Resource extends Loadable {
  type = "resource";

  public readonly referenceCount: ReferenceCount = new ReferenceCount();
  public readonly id: string;
  private readonly _path: string;

  public readonly onDestroy: ChibiEvent<this> = new ChibiEvent();

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
    this.referenceCount.inc();
  }

  public async destroy(): Promise<void> {
    this.referenceCount.dec();
    if (this.referenceCount.value <= 0) {
      await super.destroy();
      debug(this.constructor.name, this.id, "cleaned up.");
      this.onDestroy.trigger(this);
    }
  }
}
