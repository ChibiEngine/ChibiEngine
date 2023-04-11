import GameObject from "../GameObject";
import Component from "../../component/Component";
import getMethods from "../../utils/getMethods";
import ComponentProperty from "../../component/types/ComponentProperty";
import AbstractGameObject from "../AbstractGameObject";

export default function assignComponent<O extends AbstractGameObject, C extends Component<string, O>>(target: O, component: C): O & Omit<C, "name"> & ComponentProperty<C> {
  const methods = getMethods(component);
  for(const key of methods) {
    if(key === "constructor" || key === "apply" || key in target) continue;

    Object.defineProperty(target, key, {
      get: () => component[key],
      set: (value) =>  component[key] = value
    });
  }
  for(const key in component) {
    if(key == "componentName" || key in target) continue;
    if(methods.includes(key)) continue;

    Object.defineProperty(target, key, {
      get: () => component[key],
      set: (value) =>  component[key] = value
    });
  }
  //@ts-ignore
  target[component.componentName] = component;
  return target as any;
}