// types-only

import {Event} from "../../event/Event";
import IRotation from "./IRotation";

export default interface Rotationable {
  radians: number;
  degrees: number;
  onRotationChange: Event<IRotation>;
}
