import {AbstractComponent} from "../../component/Component";
import {Class, MergeIntersection} from "../../utils/Types";

type ComponentProperty<T> = T extends AbstractComponent<any> ? {
  [key in T["componentName"]]: T
} : unknown;

export type ComponentProperties<T extends Array<Class<AbstractComponent<string, any>>>> = MergeIntersection<{
  [key in keyof T]: ComponentProperty<InstanceType<T[key]>>
}>;

export default ComponentProperty;
