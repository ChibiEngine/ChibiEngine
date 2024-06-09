import Component from "../../component/Component";
import getMethods from "../../utils/getMethods";
import ComponentProperty from "../../component/types/ComponentProperty";
import AbstractGameObject from "../AbstractGameObject";

const ignore = ["constructor", "apply", "update", "variableUpdate", "componentName", "dontAddToUpdateList"];

export default function assignComponent<O extends AbstractGameObject, C extends Component<string, O>>(target: O, component: C): Omit<O & C & ComponentProperty<C>, "componentName"> {
  // @ts-ignore
  component.gameobject = target;
  for(const key of getMethods(component)) {
    if(ignore.includes(key as string) || key in target) continue;

    Object.defineProperty(target, key, {
      get: () => (component[key] as any).bind(component),
      set: (value) =>  component[key] = value
    });
  }
  for(const key in component) {
    if(ignore.includes(key as string) || key in target) continue;

    Object.defineProperty(target, key, {
      get: () => component[key],
      set: (value) =>  component[key] = value
    });
  }
  //@ts-ignore
  target[component.componentName] = component;
  return target as any;
}