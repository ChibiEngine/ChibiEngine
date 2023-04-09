import Damageable from "./Damageable";
import Container from "../../engine/gameobjects/Container";
import Position from "../../engine/geom/position/Position";
import Movable from "./Movable";
import AIController from "./AIController";

export default class Enemy extends Container.With(Damageable, Movable, AIController) {
  constructor(x: number, y: number) {
    super(new Position(x, y))
    this.addComponent(new Damageable(100));
    this.addComponent(new Movable());
    this.addComponent(new AIController());
  }
}