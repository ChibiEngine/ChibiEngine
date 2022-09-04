import Resource from "./Resource";
import * as PIXI from "pixi.js";
import newImage from "../util/createImage";

export default class Image extends Resource {
  private _texture: PIXI.Texture;

  public constructor(path: string) {
    super(path);
  }

//   TODO : gérer le cropping
//   public part(x: number, y: number, w: number, h: number): Image {
//     return new Image(this.path, x, y, w, h);
//   }

  public get texture(): PIXI.Texture {
    return this._texture;
  }

  protected async create(): Promise<void> {
    const blob = await this.request(this.path);

    // Create HTMLImageElement from blob
    const image = newImage();
    image.src = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
      image.onload = () => {
        this._texture = PIXI.Texture.from(image);
        console.log("Texture created");
        resolve();
      }
    });
  }

  protected destroy(): void {
  }
}
