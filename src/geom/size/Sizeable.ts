// types-only

import {ChibiEvent} from "../../event/ChibiEvent";
import ISize from "./ISize";

export default interface Sizeable {
  width: number;
  height: number;
  onSizeChange: ChibiEvent<[ISize]>;
}
