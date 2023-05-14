import Damageable from "./Damageable";
import Container from "../../engine/gameobjects/Container";
import Movable from "./Movable";
import AIController from "./AIController";
import Position from "../../engine/component/Position";

export default class Enemy extends Container.With(Damageable, Movable, AIController) {
  constructor(x: number, y: number) {
    super(new Position(x, y))
    this.addComponent(new Damageable(100));
    this.addComponent(new Movable());
    this.addComponent(new AIController());
  }
}