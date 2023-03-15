import Component from "../../component/Component";

type ComponentProperty<T extends Component<any>> = {
  [key in T["name"]]: T
}

export default ComponentProperty;