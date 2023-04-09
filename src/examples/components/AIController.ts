import Component from "../../engine/component/Component";
import GameObject from "../../engine/gameobjects/GameObject";
import Movable from "./Movable";

export default class AIController extends Component<"ai_controller", GameObject & Movable> {
  public readonly componentName = "ai_controller";

  private target: GameObject & Movable;
  apply(target: GameObject & Movable) {
    this.target = target;
    this.aiMove();
  }

  public aiMove() {
    console.log("ai moving");
    this.target.move();
  }
}