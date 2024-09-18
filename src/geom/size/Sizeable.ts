import {Event} from "../../event/Event";
import ISize from "./ISize";

export default interface Sizeable {
  width: number;
  height: number;
  onSizeChange: Event<ISize>;
}
