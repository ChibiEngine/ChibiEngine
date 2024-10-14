import {Container} from "pixi.js";

import GameObject from "./GameObject";

class PixiObjectImpl<T extends Container> extends GameObject {
  public pixi: T;

  constructor(private readonly object: T | ((self: GameObject) => (Promise<T> | T))) {
    super();
    if(typeof object !== "function") {
      this.pixi = object;
    }
  }

  protected async _create() {
    if(this.object instanceof Function) {
      this.pixi = await this.object(this);
    }
  }

  protected async _destroy() {
    this.pixi.destroy();
  }

}

declare type PixiObject<T extends Container> = PixiObjectImpl<T> & Omit<T, keyof PixiObjectImpl<T>>;

const PixiObject: new <T extends Container>(object: T | ((self: GameObject) => (Promise<T> | T))) => PixiObject<T> = PixiObjectImpl as any;
export default PixiObject;