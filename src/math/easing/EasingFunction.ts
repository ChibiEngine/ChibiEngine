export default abstract class EasingFunction {
  abstract apply(t: number): number;

  public interpolate(start: number, end: number, t: number): number {
    return start + (end - start) * this.apply(t);
  }
}
