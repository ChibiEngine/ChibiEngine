import {Class, ClassFull} from "../utils/Typed";
import getMethods from "../utils/getMethods";

export default function Mixin<A, B, C, D, E, F, G, H, I, J, K>(base: Class<A>, b: ClassFull<B>, c?: ClassFull<C>, d?: ClassFull<D>, e?: ClassFull<E>, f?: ClassFull<F>, g?: ClassFull<G>, h?: ClassFull<H>, i?: ClassFull<I>, j?: ClassFull<J>, k?: ClassFull<K>): ClassFull<A & B & C & D & E & F & G & H & I & J & K> {
  const mixed = [b, c, d, e, f, g, h, i, j];

  //@ts-ignore
  class MixClass extends base {
    constructor(...args: any[]) {
      super(...args);
      for(const m of mixed) {
        if(!m) break;
        Object.assign(this, new m());
      }
    }
  }

  for (const m of mixed) {
    if(!m) break;
    for(const p of getMethods(m.prototype)) {
      (MixClass.prototype as any)[p] = m.prototype[p];
    }
  }

  return MixClass as any;
}