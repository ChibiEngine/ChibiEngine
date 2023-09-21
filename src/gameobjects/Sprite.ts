import { Sprite as PixiSprite } from "pixi.js";

import Image from "../resource/Image";
import GameObject from "./GameObject";
import Position from "../component/Position";

export default class Sprite extends GameObject {
  public pixi: PixiSprite;

  public constructor(private readonly image: Image, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public async _create(): Promise<void> {
    const image = await this.load(this.image);
    this.pixi = new PixiSprite(image.pixi);
    this.setPosition(this.position);
  }

  public setTexture(image: Image) {
    this.load(image).then(img => {
      this.pixi.texture = img.pixi;
    });
    return this;
  }

  public setAnchor(x: number, y: number) {
    this.whenLoaded(() => {
      this.pixi.anchor.set(x, y);
    });
    return this;
  }

  public async _destroy() {
    this.pixi.destroy();
    // image auto release in Loadable
  }
}
