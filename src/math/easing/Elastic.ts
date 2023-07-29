import EasingFunction from "./EasingFunction";

export class ElasticOut implements EasingFunction {
  public static readonly INSTANCE = new ElasticOut();

  public constructor(private readonly amplitude: number = 0.1, private readonly period: number = 0.4) { }

  public apply(t: number): number {
    if (t === 0 || t === 1) {
      return t;
    } else {
      const s = this.period / (2 * Math.PI) * Math.asin(1 / this.amplitude);
      return this.amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / this.period) + 1;
    }
  }
}

export class ElasticIn implements EasingFunction {
  public static readonly INSTANCE = new ElasticIn();

  public constructor(private readonly amplitude: number = 0.1, private readonly period: number = 0.4) { }

  public apply(t: number): number {
    if (t === 0 || t === 1) {
      return t;
    } else {
      const s = this.period / (2 * Math.PI) * Math.asin(1 / this.amplitude);
      return -(this.amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / this.period));
    }
  }
}

export class ElasticInOut implements EasingFunction {
  public static readonly INSTANCE = new ElasticInOut();

  public constructor(private readonly amplitude: number = 0.1, private readonly period: number = 0.4) { }

  public apply(t: number): number {
    if (t === 0 || t === 1) {
      return t;
    } else {
      const s = this.period / (2 * Math.PI) * Math.asin(1 / this.amplitude);
      if ((t *= 2) < 1) {
        return -0.5 * (this.amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / this.period));
      } else {
        return this.amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * (2 * Math.PI) / this.period) * 0.5 + 1;
      }
    }
  }
}