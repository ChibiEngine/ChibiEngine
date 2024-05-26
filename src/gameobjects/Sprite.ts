import { Sprite as PixiSprite } from "pixi.js";

import Texture from "../resource/Texture";
import GameObject from "./GameObject";
import Position from "../component/Position";

export default class Sprite extends GameObject {
  public pixi: PixiSprite;

  public constructor(public readonly texture: Texture, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public async _create(): Promise<void> {
    const image = await this.load(this.texture);
    this.pixi = new PixiSprite(image.pixi);
    this.setPosition(this.position);
  }

  public setTexture(texture: Texture) {
    this.load(texture).then(texture1 => {
      this.pixi.texture = texture1.pixi;
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
