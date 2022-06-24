import Resource from "./Resource";

export default class Image extends Resource {
  // internal: HTMLImageElement
  public constructor(
    private readonly path: string,
    private readonly x: number = 0,
    private readonly y: number = 0,
    private readonly w: number = 0,
    private readonly h: number = 0
  ) {
    super();
  }

  public part(x: number, y: number, w: number, h: number): Image {
    return new Image(this.path, x, y, w, h);
  }
}
