import EasingFunction from "./EasingFunction";

export class SineIn extends EasingFunction {
  public static readonly INSTANCE = new SineIn();

  public apply(t: number): number {
    if (t === 0 || t === 1) {
      return t;
    }
    return 1 - Math.cos(t * Math.PI / 2);
  }
}

export class SineOut extends EasingFunction {
  public static readonly INSTANCE = new SineOut();

  public apply(t: number): number {
    if (t === 0 || t === 1) {
      return t;
    }
    return Math.sin(t * Math.PI / 2);
  }
}

export class SineInOut extends EasingFunction {
  public static readonly INSTANCE = new SineInOut();

  public apply(t: number): number {
    if (t === 0 || t === 1) {
      return t;
    }
    return 0.5 * (1 - Math.cos(Math.PI * t));
  }
}