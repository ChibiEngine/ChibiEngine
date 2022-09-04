import { Sprite as PixiSprite } from "pixi.js";
import Image from "../resource/Image";
import INode from "./INode";
import Position from "../geom/position/Position";
import {assignPosition} from "../geom/utils";

export default class Sprite extends INode {
  public _internal: PixiSprite;

  public constructor(private readonly image: Image, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public async create(): Promise<void> {
    // Load Texture
    // TODO: syntaxe bizarre, on s'attendrait à juste faire `const image = await this.load(this.image)` sans le .loaded
    //
    const image = await this.load(this.image).loaded;
    this._internal = new PixiSprite(image.texture);
    assignPosition(this._internal, this.position);
  }

  public destroy(): void {
    this._internal.destroy();
    this.image.release();
  }
}
