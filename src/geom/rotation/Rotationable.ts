// types-only

import {ChibiEvent} from "../../event/ChibiEvent";
import IRotation from "./IRotation";

export default interface Rotationable {
  radians: number;
  degrees: number;
  onRotationChange: ChibiEvent<[IRotation]>;
}
