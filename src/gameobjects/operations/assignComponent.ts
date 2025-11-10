import {Component} from "../../component/Component";
import getProperties from "../../utils/getProperties";
import ComponentProperty from "../../component/types/ComponentProperty";
import AbstractGameObject from "../AbstractGameObject";

const ignore = ["constructor", "apply", "update", "variableUpdate", "componentName", "dontAddToUpdateList"];

export default function assignComponent<O extends AbstractGameObject, C extends Component<string, O>>(target: O, component: C): O & C & ComponentProperty<C> {
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

  const componentPropertyDefinition = {
    get: () => component,
    set: (value: C) => {
      // Destroy old component if any
      if(component.componentName in target) {
        target.removeComponent(target[component.componentName as keyof AbstractGameObject] as Component<string, O>);
      }
      target.addComponent(value);
    },
    enumerable: true,
    configurable: true,
  };

  Object.defineProperty(target, component.componentName, componentPropertyDefinition);
  Object.defineProperty(target.components, component.componentName, componentPropertyDefinition);
  return target as any;
}