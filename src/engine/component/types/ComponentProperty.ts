import Component from "../../component/Component";

type ComponentProperty<T> = T extends Component<any> ? {
  [key in T["name"]]: T
} : unknown;

export default ComponentProperty;