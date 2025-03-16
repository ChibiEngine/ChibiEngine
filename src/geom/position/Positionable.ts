// types-only

import {ChibiEvent} from "../../event/ChibiEvent";
import IPosition from "./IPosition";

export default interface Positionable {
  x: number;
  y: number;
  onPositionChange: ChibiEvent<[IPosition]>;
}
