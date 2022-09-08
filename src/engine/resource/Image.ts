import Resource from "./Resource";
import * as PIXI from "pixi.js";
import Blob from "../loader/Blob";
import {DomImage} from "../util/dom";

export default class Image extends Resource {
  private _texture: PIXI.Texture;

  public constructor(path: string) {
    super(path);
  }

//   TODO : gérer le cropping : update texture's frame
//   Multiple textures share same base texture
//   public part(x: number, y: number, w: number, h: number): Image {
//     return new Image(this.path, x, y, w, h);
//   }

  public get texture(): PIXI.Texture {
    return this._texture;
  }

  protected async _create(): Promise<void> {
    const blob = await this.load(new Blob(this.path)).loaded;

    // Create HTMLImageElement from blob
    const image = new DomImage();
    image.src = blob.url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        this._texture = PIXI.Texture.from(image);
        resolve();
      };
      image.onerror = reject;
    });
  }

  protected async _destroy() {
    this._texture.destroy();
  }
}
