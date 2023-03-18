import {EventListener} from "./Event";

export default interface Observable {
  onChange(callback: (this: this) => void): EventListener<this>;
}