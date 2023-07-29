import Event from "../../event/Event";
import IPosition from "./IPosition";

export default interface Positionable {
  x: number;
  y: number;
  onPositionChange: Event<IPosition>;
}
