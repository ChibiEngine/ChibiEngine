import {Class} from "../utils/type_utils";
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


export type ClassArrayType<T> = T extends Array<Class<infer U>> ? U : never;

// -> IntelliJ IDEA's TypeScript plugin doesn't like this
// export type ClassArrayTypeOmit<T, toOmit extends string> = T extends Array<Class<infer U>> ? Omit<U, toOmit> : never;
//
// Example :
// const enemy = this.add(new Enemy(100, 100));
// enemy.health = 10;  // IntelliJ IDEA TypeScript plugin issue: thinks health is a readonly property, but it's not
//

export type ClassArrayTypeOmit<T, toOmit extends string> = ClassArrayType<T> & {[key in toOmit]: never};

export default function Mixin<Base extends abstract new (...args: any) => any, A extends Array<Class<any>>>(Base: Base, ...classes: A): Class<InstanceType<Base> & UnionToIntersection<ClassArrayType<A>> & Mixed> {
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