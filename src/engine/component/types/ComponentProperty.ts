import Component, {AbstractComponent} from "../../component/Component";
import {MergeIntersection, Class} from "../../utils/type_utils";

type ComponentProperty<T> = T extends AbstractComponent<any> ? {
  [key in T["name"]]: T
} : unknown;

export type ComponentProperties<T extends Array<Class<AbstractComponent<string, any>>>> = MergeIntersection<{
  [key in keyof T]: ComponentProperty<InstanceType<T[key]>>
}>;

export default ComponentProperty;
