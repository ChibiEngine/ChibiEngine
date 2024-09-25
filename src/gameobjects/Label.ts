import GameObject from "./GameObject";
import { Text as PixiText, TextStyle } from "pixi.js";

export default class Label extends GameObject {
  public pixi: PixiText;

  constructor(public text: string, private readonly style: Partial<TextStyle> = undefined) {
    super();
  }

  public set fill(color: number) {
    this.pixi.style.fill = color;
  }

  public set fontSize(size: number) {
    this.pixi.style.fontSize = size;
  }

  public set fontFamily(family: string) {
    this.pixi.style.fontFamily = family;
  }

  public set stroke(color: number) {
    this.pixi.style.stroke = color;
  }

  protected async _create() {
    this.pixi = new PixiText(this.text, this.style);
    this.setPosition(this.position); // useless?
  }

  protected async _destroy() {
    this.pixi.destroy();
  }
}