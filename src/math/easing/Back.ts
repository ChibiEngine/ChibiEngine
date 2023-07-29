import EasingFunction from "./EasingFunction";

export class BackOut implements EasingFunction {
  public static readonly INSTANCE = new BackOut();

  public constructor(private readonly overshoot: number = 1.70158) { }

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return ((t = t - 1) * t * ((this.overshoot + 1) * t + this.overshoot) + 1);
  }
}

export class BackIn implements EasingFunction {
  public static readonly INSTANCE = new BackIn();

  public constructor(private readonly overshoot: number = 1.70158) { }

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return t * t * ((this.overshoot + 1) * t - this.overshoot);
  }
}

export class BackInOut implements EasingFunction {
  public static readonly INSTANCE = new BackInOut();

  public constructor(private readonly overshoot: number = 1.70158) { }

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    const s = this.overshoot * 1.525;
    if ((t *= 2) < 1) {
      return 0.5 * (t * t * ((s + 1) * t - s));
    } else {
      return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2);
    }
  }
}