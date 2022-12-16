export default interface EasingFunction {
  apply(t: number): number;
}

export module Easing {
  export class Linear implements EasingFunction {
    public static easeNone = (t: number) => t;

    public apply(t: number): number {
      return t;
    }
  }

  export class CubicBezier {
    public static easeIn = (t: number) => t * t * t;
    public static easeOut = (t: number) => --t * t * t + 1;
    public static easeInOut = (t: number) => (t *= 2) < 1 ? 0.5 * t * t * t : 0.5 * ((t -= 2) * t * t + 2);
  }
}
