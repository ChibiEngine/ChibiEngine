// types-only

import {ChibiEvent} from "../../event/ChibiEvent";
import IScale from "./IScale";

export default interface Scalable {
  x: number;
  y: number;
  onScaleChange: ChibiEvent<[IScale]>;
}
