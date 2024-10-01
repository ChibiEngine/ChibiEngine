// types-only

import {Event} from "../../event/Event";
import IScale from "./IScale";

export default interface Scalable {
  x: number;
  y: number;
  onScaleChange: Event<IScale>;
}
