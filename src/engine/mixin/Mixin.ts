import {ClassFull} from "../utils/Typed";
import getMethods from "../utils/getMethods";

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

export default function Mixin<Base extends abstract new (...args: any) => any, B, C = unknown, D = unknown, E = unknown, F = unknown, G = unknown, H = unknown, I = unknown, J = unknown, K = unknown>(Base: Base, b: ClassFull<B>, c?: ClassFull<C>, d?: ClassFull<D>, e?: ClassFull<E>, f?: ClassFull<F>, g?: ClassFull<G>, h?: ClassFull<H>, i?: ClassFull<I>, j?: ClassFull<J>, k?: ClassFull<K>): ClassFull<InstanceType<Base> & B & C & D & E & F & G & H & I & J & K & Mixed> {
  abstract class MixClass extends Base {
    constructor(...args: any[]) {
      super(...args);
    }
  }

  const mixed = [Mixed, b, c, d, e, f, g, h, i, j];

  for (const m of mixed) {
    if (!m) break;
    for (const p of getMethods(m)) {
      (MixClass.prototype as any)[p] = m.prototype[p];
    }
  }

  return MixClass as any;
}