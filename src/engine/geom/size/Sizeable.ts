import Event from "../../event/Event";
import Size from "./Size";

export default interface Sizeable {
  width: number;
  height: number;
  onSizeChange: Event<Size>;
}
