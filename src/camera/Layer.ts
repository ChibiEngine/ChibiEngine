import Container from "../gameobjects/Container";

export default class Layer extends Container {
  private layer = true;
  public scrollFactor = {x: 1, y: 1};
  public constructor() {
    super();
  }

  public setScrollFactor(x: number, y: number = x) {
    this.scrollFactor.x = x;
    this.scrollFactor.y = y;

    return this;
  }
}