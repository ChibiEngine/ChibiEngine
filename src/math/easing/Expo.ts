import EasingFunction from "./EasingFunction";

export class ExpoIn implements EasingFunction {
  public static readonly INSTANCE = new ExpoIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return Math.pow(2, 10 * (t - 1));
  }
}

export class ExpoOut implements EasingFunction {
  public static readonly INSTANCE = new ExpoOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return -Math.pow(2, -10 * t) + 1;
  }
}

export class ExpoInOut implements EasingFunction {
  public static readonly INSTANCE = new ExpoInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if ((t *= 2) < 1) {
      return 0.5 * Math.pow(2, 10 * (t - 1));
    } else {
      return 0.5 * (-Math.pow(2, -10 * (t - 1)) + 2);
    }
  }
}