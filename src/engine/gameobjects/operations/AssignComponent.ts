import GameObject from "../GameObject";
import Component from "../../component/Component";
import ComponentProperty from "./ComponentProperty";
import getMethods from "../../utils/getMethods";

export default function AssignComponent<O extends GameObject, C extends Component<any>>(target: O, component: C): O & Omit<C, "name"> & ComponentProperty<C> {
  for(const key of getMethods(component)) {
    if(key === "constructor") continue;
    Object.defineProperty(target, key, {
      get: () => component[key]
    });
  }
  for(const key in component) {
    Object.defineProperty(target, key, {
      get: () => component[key],
      set: (value) =>  component[key] = value
    });
  }
  //@ts-ignore
  target[component.name] = component;
  return target as any;
}