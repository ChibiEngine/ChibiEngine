import Component from "../../component/Component";
import {MergeIntersection} from "../../utils/type_utils";
import {Class} from "../../utils/Typed";

type ComponentProperty<T> = T extends Component<any> ? {
  [key in T["name"]]: T
} : unknown;

export type ComponentProperties<T extends Array<Class<Component<string, any>>>> = MergeIntersection<{
  [key in keyof T]: ComponentProperty<InstanceType<T[key]>>
}>;

export default ComponentProperty;
