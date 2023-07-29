import GameObject from "./GameObject";
import { Container } from "pixi.js";

class PixiObjectImpl<T extends Container> extends GameObject {
  public pixi: T;

  constructor(object: T) {
    super();
    this.pixi = object;
    return new Proxy(this, {
      get(target, prop) {
        if(prop in target) {
          //@ts-ignore
          return target[prop];
        } else {
          //@ts-ignore
          return target.pixi[prop];
        }
      },
      set(target, prop, value) {
        if(prop in target) {
          //@ts-ignore
          target[prop] = value;
        }
        else {
          //@ts-ignore
          target.pixi[prop] = value;
        }
        return true;
      },
      deleteProperty(target: PixiObjectImpl<T>, p: string | symbol): boolean {
        if(p in target) {
          //@ts-ignore
          delete target[p];
        } else {
          //@ts-ignore
          delete target.pixi[p];
        }
        return true;
      }
    })
  }

  protected async _create() {

  }

  protected async _destroy() {
    this.pixi.destroy();
  }

}

declare type PixiObject<T extends Container> = PixiObjectImpl<T> & T;

const PixiObject: new <T extends Container>(object: T) => PixiObject<T> = PixiObjectImpl as any;
export default PixiObject;
