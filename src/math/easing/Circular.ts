import EasingFunction from "./EasingFunction";

export class CircularIn extends EasingFunction {
  public static readonly INSTANCE = new CircularIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return 1 - Math.sqrt(1 - t * t);
  }
}

export class CircularOut extends EasingFunction {
  public static readonly INSTANCE = new CircularOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return Math.sqrt(1 - (t - 1) * (t - 1));
  }
}

export class CircularInOut extends EasingFunction {
  public static readonly INSTANCE = new CircularInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if ((t *= 2) < 1) {
      return -0.5 * (Math.sqrt(1 - t * t) - 1);
    } else {
      return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
    }
  }
}