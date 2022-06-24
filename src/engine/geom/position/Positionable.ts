import Event from "../../event/Event";
import Position from "./Position";

export default interface Positionable {
  x: number;
  y: number;
  onPositionChange: Event<Position>;
}
