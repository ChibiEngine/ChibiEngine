import { Sprite as PixiSprite } from "pixi.js";
import Image from "../resource/Image";
import INode from "./INode";
import Position from "../geom/position/Position";

export default class Sprite extends INode {
  public _internal: PixiSprite;

  public constructor(private readonly image: Image, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public async create(): Promise<void> {
    // Load Texture
    const image = await this.load(this.image);
    this._internal = new PixiSprite(image.texture);
    this._internal.x = this.x;
    this._internal.y = this.y;
  }

  public destroy(): void {
    this._internal.destroy();
    this.image.release();
  }
}
