import { Sprite as PixiSprite } from "pixi.js";

import Texture from "../resource/resources/Texture";
import GameObject from "./GameObject";
import Position from "../component/Position";

export default class Sprite extends GameObject {
  public pixi: PixiSprite;

  public constructor(private _texture: Texture, x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  public set texture(texture: Texture) {
    this.setTexture(texture);
  }

  public get texture() {
    return this._texture;
  }

  public async _create(): Promise<void> {
    const image = await this.load(this.texture);
    this.pixi = new PixiSprite(image.pixi);
    this.setPosition(this.position); // useless?
  }

  public setTexture(texture: Texture): this & PromiseLike<this> {
    this.load(texture).then(texture1 => {
      this.pixi.texture = texture1.pixi;
      this._texture = texture;
      this.updateOriginalSize();
    });

    return this as this & PromiseLike<this>;
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
