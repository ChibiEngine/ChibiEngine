import {Component} from "../../component/Component";
import getProperties from "../../utils/getProperties";
import ComponentProperty from "../../component/types/ComponentProperty";
import AbstractGameObject from "../AbstractGameObject";

const ignore = ["constructor", "apply", "update", "variableUpdate", "componentName", "dontAddToUpdateList"];

export default function assignComponent<O extends AbstractGameObject, C extends Component<string, O>>(target: O, component: C): O & Omit<C, "componentName"> & ComponentProperty<C> {
  // @ts-ignore
  component.gameobject = target;

  const properties = getProperties(component);
  for(const [key, descriptor] of Object.entries(properties)) {
    if(ignore.includes(key) || key in target) continue;

    const get = descriptor?.get?.bind(component);
    const set = descriptor?.set?.bind(component);

    if(get || set) {
      Object.defineProperty(target, key, { get, set });
    } else if("value" in descriptor) {
      if(typeof descriptor.value === "function") {
        const bindToComponent = "bindToComponent" in descriptor.value ? descriptor.value.bindToComponent : true;
        // @ts-ignore
        target[key] = bindToComponent ? descriptor.value.bind(component) : descriptor.value;
      } else {
        Object.defineProperty(target, key, {
        // @ts-ignore
          get: () => component[key],
        // @ts-ignore
          set: (value) => component[key] = value
        });
      }
    }
  }

  //@ts-ignore
  target[component.componentName] = component;
  return target as any;
}