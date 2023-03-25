import {ClassFull} from "../utils/Typed";
import getMethods from "../utils/getMethods";
import {UnionToIntersection} from "../utils/type_utils";

export class Mixed {
  protected mixin<T extends object>(target: T) {
    for (const method of getMethods(target)) {
      if (method === "constructor") continue;
      Object.defineProperty(this, method, {
        get: () => target[method],
        configurable: true
      });
    }
    for (const key in target) {
      Object.defineProperty(this, key, {
        value: target[key],
        configurable: true
      });
    }
    return target as any;
  }
}


export type ClassArrayType<T> = T extends Array<ClassFull<infer U>> ? U : never;

export default function Mixin<Base extends abstract new (...args: any) => any, A extends Array<ClassFull<any>>>(Base: Base, ...classes: A): ClassFull<InstanceType<Base> & UnionToIntersection<ClassArrayType<A>> & Mixed> {
  abstract class MixClass extends Base {
    constructor(...args: any[]) {
      super(...args);
    }
  }

  const mixed = [Mixed, ...classes];

  for (const m of mixed) {
    if (!m) break;
    for (const p of getMethods(m)) {
      (MixClass.prototype as any)[p] = m.prototype[p];
    }
  }

  return MixClass as any;
}