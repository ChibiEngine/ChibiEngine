import EasingFunction from "./EasingFunction";

export default class Linear implements EasingFunction {
  public static readonly INSTANCE = new Linear();

  public apply(t: number): number {
    return t;
  }
}
