import EasingFunction from "./EasingFunction";

export class BounceOut implements EasingFunction {
  public static readonly INSTANCE = new BounceOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if (t < (1 / 2.75)) {
      return 7.5625 * t * t;
    } else if (t < (2 / 2.75)) {
      return 7.5625 * (t -= (1.5 / 2.75)) * t + 0.75;
    } else if (t < (2.5 / 2.75)) {
      return 7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375;
    } else {
      return 7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375;
    }
  }
}

export class BounceIn implements EasingFunction {
  public static readonly INSTANCE = new BounceIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return 1 - BounceOut.INSTANCE.apply(1 - t);
  }
}

export class BounceInOut implements EasingFunction {
  public static readonly INSTANCE = new BounceInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if (t < 0.5) {
      return BounceIn.INSTANCE.apply(t * 2) * 0.5;
    } else {
      return BounceOut.INSTANCE.apply(t * 2 - 1) * 0.5 + 0.5;
    }
  }
}