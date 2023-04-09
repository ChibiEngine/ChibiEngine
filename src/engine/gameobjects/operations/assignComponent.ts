import GameObject from "../GameObject";
import Component from "../../component/Component";
import getMethods from "../../utils/getMethods";
import ComponentProperty from "../../component/types/ComponentProperty";
import AbstractGameObject from "../AbstractGameObject";

export default function assignComponent<O extends AbstractGameObject, C extends Component<string, O>>(target: O, component: C): O & Omit<C, "name"> & ComponentProperty<C> {
  for(const key of getMethods(component)) {
    if(key === "constructor") continue;
    Object.defineProperty(target, key, {
      get: () => component[key],
      set: (value) =>  component[key] = value
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