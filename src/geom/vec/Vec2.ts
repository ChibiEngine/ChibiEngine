import IVec2 from "./IVec2";

export default class Vec2 implements IVec2 {
  public static readonly ZERO = new Vec2(0, 0);

  public constructor(public readonly x: number = 0, public readonly y: number = x) {

  }

}