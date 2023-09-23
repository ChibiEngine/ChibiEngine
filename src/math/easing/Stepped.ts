import EasingFunction from "./EasingFunction";

export class Stepped extends EasingFunction {
  public static readonly INSTANCE = new Stepped();

  public constructor(private readonly steps: number = 1) {
  }

  public apply(t: number): number {
    return Math.floor(t * this.steps) / this.steps;
  }
}