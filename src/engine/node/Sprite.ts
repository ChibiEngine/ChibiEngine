import { Sprite as PixiSprite } from "pixi.js";
import Image from "../resource/Image";
import AbstractNode from "./AbstractNode";
import Position from "../geom/position/Position";
import {assignPosition} from "../geom/utils";

export default class Sprite extends AbstractNode {
  public _internal: PixiSprite;

  public constructor(private readonly image: Image, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public async _create(): Promise<void> {
    // Load Texture
    // TODO: syntaxe bizarre, on s'attendrait à juste faire `const image = await this.load(this.image)` sans le .loaded
    //
    const image = await this.load(this.image).finishLoading();
    this._internal = new PixiSprite(image.texture);
    assignPosition(this._internal, this.position);
  }

  public async _destroy() {
    this._internal.destroy();
    // image auto release in Loadable
  }
}
