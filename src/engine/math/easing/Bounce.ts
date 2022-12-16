import EasingFunction from "./EasingFunction";

export class BounceOut implements EasingFunction {
  public apply(t: number): number {
    if (t < 1 / 2.75)
    {
      return 7.5625 * t * t;
    }
    else if (t < 2 / 2.75)
    {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    }
    else if (t < 2.5 / 2.75)
    {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    }
    else
    {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
}