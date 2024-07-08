import { Texture as PixiTexture, Rectangle, SCALE_MODES } from "pixi.js";

import Resource from "../Resource";
import {DomImage} from "../../utils/dom";
import Blob from "./Blob";

export interface ImageOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  pixelScale?: boolean;
}

export default class Texture extends Resource {
  public pixi: PixiTexture;
  private readonly baseImage: Texture;
  private readonly frame: Rectangle;
  private readonly pixelScale: boolean;

  public constructor(path: string, {x, y, width, height, pixelScale}: ImageOptions = {}) {
    super(path, x, y, width, height);
    this.pixelScale = pixelScale || false;
    if(x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
      this.baseImage = new Texture(path, {pixelScale});
      this.frame = new Rectangle(x, y, width, height);
    }
  }

  public part(x: number, y: number, width: number, height: number): Texture {
    return new Texture(this.path, {x, y, width, height, pixelScale: this.pixelScale});
  }

  protected async _create(): Promise<void> {
    if(this.baseImage) {
      await this.load(this.baseImage);
      this.pixi = new PixiTexture(this.baseImage.pixi.baseTexture, this.frame);
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
        this.pixi = PixiTexture.from(image);
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
