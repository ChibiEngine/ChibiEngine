export default class ReferenceCount {
  private _value: number = 0;

  constructor() {
    this._value = 0;
  }

  public inc(): void {
    this._value++;
  }

  public dec(): void {
    this._value--;
  }

  public get value(): number {
    return this._value;
  }
}