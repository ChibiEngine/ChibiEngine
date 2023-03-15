import {Class, ClassFull} from "../utils/Typed";
import getMethods from "../utils/getMethods";

export class Mixin_ {
  protected mixin(target: object) {
    for (const method of getMethods(target)) {
      if (method === "constructor") continue;
      Object.defineProperty(this, method, {
        get: () => target[method]
      });
    }
    for (const key in target) {
      Object.defineProperty(this, key, {
        value: target[key]
      });
    }
    return target as any;
  }
}

export default function Mixin<A, B, C, D, E, F, G, H, I, J, K>(base: Class<A>, b: ClassFull<B>, c?: ClassFull<C>, d?: ClassFull<D>, e?: ClassFull<E>, f?: ClassFull<F>, g?: ClassFull<G>, h?: ClassFull<H>, i?: ClassFull<I>, j?: ClassFull<J>, k?: ClassFull<K>): ClassFull<A & B & C & D & E & F & G & H & I & J & K & Mixin_> {
  const mixed = [Mixin_, b, c, d, e, f, g, h, i, j];

  //@ts-ignore
  class MixClass extends base {
    constructor(...args: any[]) {
      super(...args);
      for (const m of mixed) {
        if (!m) break;
        Object.assign(this, new m());
      }
    }
  }

  for (const m of mixed) {
    if (!m) break;
    for (const p of getMethods(m)) {
      (MixClass.prototype as any)[p] = m.prototype[p];
    }
  }

  return MixClass as any;
}