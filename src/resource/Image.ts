import { Texture, Rectangle, SCALE_MODES } from "pixi.js";

import Resource from "./Resource";
import Blob from "./Blob";
import {DomImage} from "../utils/dom";

export interface ImageOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  pixelScale?: boolean;
}

export default class Image extends Resource {
  public pixi: Texture;
  private readonly baseImage: Image;
  private readonly frame: Rectangle;
  private readonly pixelScale: boolean;

  public constructor(path: string, {x, y, width, height, pixelScale}: ImageOptions = {}) {
    super(path, x, y, width, height);
    this.pixelScale = pixelScale || false;
    if(x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
      this.baseImage = new Image(path, {pixelScale});
      this.frame = new Rectangle(x, y, width, height);
    }
  }

  public part(x: number, y: number, width: number, height: number): Image {
    return new Image(this.path, {x, y, width, height, pixelScale: this.pixelScale});
  }

  protected async _create(): Promise<void> {
    if(this.baseImage) {
      await this.load(this.baseImage);
      this.pixi = new Texture(this.baseImage.pixi.baseTexture, this.frame);
      if(this.pixelScale) {
        this.pixi.baseTexture.scaleMode = SCALE_MODES.NEAREST;
      }
      return;
    }

    const blob = await this.load(new Blob(this.path));

    // Create HTMLImageElement from blob
    const image = new DomImage();
    image.src = blob.url;

    return new Promise((resolve, reject) => {
      image.onload = () => {
        this.pixi = Texture.from(image);
        if(this.pixelScale) {
          this.pixi.baseTexture.scaleMode = SCALE_MODES.NEAREST;
        }
        if(this.frame) {
          this.pixi.frame = this.frame;
        }
        resolve();
      };
      image.onerror = reject;
    });
  }

  protected async _destroy() {
    this.pixi.destroy();
  }
}
