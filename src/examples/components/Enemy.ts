import Damageable from "./Damageable";
import Container from "../../engine/gameobjects/Container";
import Position from "../../engine/geom/position/Position";

export default class Enemy extends Container.With(Damageable) {
  constructor(x: number, y: number) {
    super(new Position(x, y))
    this.addComponent(new Damageable(100));
  }
}