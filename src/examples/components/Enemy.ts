import Damageable from "./Damageable";
import Container from "../../engine/gameobjects/Container";
import Position from "../../engine/geom/position/Position";

export default class Enemy extends Container {
  public readonly damageable: Damageable;

  constructor(x: number, y: number) {
    super(new Position(x, y));
    this.damageable = this.addComponent(new Damageable());
  }
}