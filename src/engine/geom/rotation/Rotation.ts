import Event from "../../event/Event";
import {degreesToRadians, radiansToDegrees} from "../../math/utils";

export default class Rotation {
  public readonly onChange: Event<Rotation> = new Event();

  private _radians: number;

  public constructor(radians: number = 0) {
    this._radians = radians;
  }

  public get radians() {
    return this._radians;
  }

  public set radians(radians: number) {
    this._radians = radians;
    this.onChange.trigger(this);
  }

  public get degrees() {
    return radiansToDegrees(this._radians);
  }

  public set degrees(degrees: number) {
    this._radians = degreesToRadians(degrees);
    this.onChange.trigger(this);
  }

  public static ofRadians(radians: number) {
    return new Rotation(radians);
  }

  public static ofDegrees(degrees: number) {
    return new Rotation(degreesToRadians(degrees));
  }

  public static zero() {
    return new Rotation(0);
  }
}
