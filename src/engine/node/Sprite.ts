import { Sprite as PixiSprite } from "pixi.js";
import Image from "../resource/Image";
import INode from "./INode";

export default class Sprite extends INode {
  protected internal: PixiSprite;

  public constructor(image: Image, x: number = 0, y: number = 0) {
    super();
    // Load Texture
    this.internal = new PixiSprite();
  }

  public destroy(): void {
    throw new Error("Method not implemented.");
  }
}
