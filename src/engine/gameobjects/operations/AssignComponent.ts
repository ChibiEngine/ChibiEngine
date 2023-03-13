import GameObject from "../GameObject";
import Component from "../../component/Component";
import ComponentProperty from "./ComponentProperty";

export default function AssignComponent<O extends GameObject, C extends Component<any>>(target: O, component: C): O & Omit<C, "name"> & ComponentProperty<C> {
  for(const key of Object.getOwnPropertyNames(Object.getPrototypeOf(component)) as (keyof C)[]) {
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
  this[component.name] = component;
  // Object.defineProperty(this, component.name, {
  //   value: component
  // })
  return target as any;
}