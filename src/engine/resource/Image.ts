import Resource from "./Resource";
import * as PIXI from "pixi.js";
import Blob from "./Blob";
import {DomImage} from "../util/dom";

export default class Image extends Resource {
  private _texture: PIXI.Texture;
  private baseImage: Image;
  private readonly frame: PIXI.Rectangle;

  public constructor(path: string, x: number = -1, y: number = -1, width: number = -1, height: number = -1) {
    super(path, x, y, width, height);
    if(x !== -1 && y !== -1 && width !== -1 && height !== -1) {
      this.baseImage = new Image(path);
      this.frame = new PIXI.Rectangle(x, y, width, height);
    }
  }

  public part(x: number, y: number, width: number, height: number): Image {
    return new Image(this.path, x, y, width, height);
  }

  public get texture(): PIXI.Texture {
    return this._texture;
  }

  protected async _create(): Promise<void> {
    if(this.baseImage) {
      /* TODO : on voudrait juste avoir besoin de faire un await this.load(this.baseImage), sans réassignation
                this.load(xxx) transforme son paramètre en proxy vers la ressource en cache ?
       */
      this.baseImage = await this.load(this.baseImage);
      this._texture = new PIXI.Texture(this.baseImage.texture.baseTexture, this.frame);
      return;
    }

    const blob = await this.load(new Blob(this.path));

    // Create HTMLImageElement from blob
    const image = new DomImage();
    image.src = blob.url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        this._texture = PIXI.Texture.from(image);
        if(this.frame) {
          this._texture.frame = this.frame;
        }
        resolve();
      };
      image.onerror = reject;
    });
  }

  protected async _destroy() {
    this._texture.destroy();
  }
}
