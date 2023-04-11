import {Sprite as PixiSprite} from "pixi.js";
import Image from "../resource/Image";
import GameObject from "./GameObject";
import Position from "../geom/position/Position";

export default class Sprite extends GameObject {
  public pixi: PixiSprite;

  public constructor(private readonly image: Image, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public async _create(): Promise<void> {
    // Load Texture
    // TODO: syntaxe bizarre, on s'attendrait à juste faire `const image = await this.load(this.image)` sans le .loaded
    //
    const image = await this.load(this.image);
    this.pixi = new PixiSprite(image.texture);
    this.setPosition(this.position);
  }

  public async _destroy() {
    this.pixi.destroy();
    // image auto release in Loadable
  }
}
