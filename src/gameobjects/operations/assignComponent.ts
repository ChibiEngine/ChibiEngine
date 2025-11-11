import {Component} from "../../component/Component";
import getProperties from "../../utils/getProperties";
import ComponentProperty from "../../component/types/ComponentProperty";
import AbstractGameObject from "../AbstractGameObject";

const ignore = ["constructor", "apply", "update", "variableUpdate", "componentName", "dontAddToUpdateList"];

export default function assignComponent<O extends AbstractGameObject, C extends Component<string, O>>(target: O, component: C): O & C & ComponentProperty<C> {
  component.gameobject = target;

  const properties = getProperties(component);
  for(const [key, descriptor] of Object.entries(properties)) {
    if(ignore.includes(key) || key in target && !target.__componentPropsAliases.includes(key)) continue;

    target.__componentPropsAliases.push(key);

    // If the property is a getter/setter, bind it on the target
    const get = descriptor?.get?.bind(component);
    const set = descriptor?.set?.bind(component);

    if(get || set) {
      Object.defineProperty(target, key, { get, set, configurable: true });
    } else if("value" in descriptor) {
      if(typeof descriptor.value === "function") { // TODO explain this
        const bindToComponent = "bindToComponent" in descriptor.value ? descriptor.value.bindToComponent : true;
        // @ts-ignore
        target[key] = bindToComponent ? descriptor.value.bind(component) : descriptor.value;
      } else {
        Object.defineProperty(target, key, {
        // @ts-ignore
          get: () => component[key],
        // @ts-ignore
          set: (value) =>  component[key] = value,
          configurable: true
        });
      }
    }
  }

  const componentPropertyDefinition = {
    get: () => component,
    set: (newComponent: C) => {
      target.removeComponent(component);
      if(newComponent) {
        target.addComponent(newComponent);
      }
    },
    delete: () => {
      target.removeComponent(component);
    },
    enumerable: true,
    configurable: true,
  };

  Object.defineProperty(target, component.componentName, componentPropertyDefinition);
  Object.defineProperty(target.components, component.componentName, componentPropertyDefinition);
  return target as any;
}