import GameObject from "./GameObject";
import { Graphics as PixiGraphics } from "pixi.js";
import Position from "../component/Position";
import Rectangle from "../geom/rect/Rectangle";

export default class Graphics extends GameObject {
  public pixi: PixiGraphics;

  private fillColor: number;
  private fillAlpha: number;

  private lineColor: number;
  private lineAlpha: number;
  private lineWidth: number;

  constructor(x: number = 0, y: number = 0) {
    super(new Position(x, y));
  }

  protected async _create() {
    this.pixi = new PixiGraphics();
  }

  public setFillStyle(color: number, alpha: number = 1) {
    this.fillColor = color;
    this.fillAlpha = alpha;
    this.pixi.beginFill(color, alpha);
  }

  public setLineStyle(width: number, color: number, alpha: number = 1) {
    this.lineColor = color;
    this.lineAlpha = alpha;
    this.lineWidth = width;
    this.pixi.lineStyle(width, color, alpha);
  }

  public drawRect(rect: Rectangle) {
    this.pixi.drawRect(rect.x, rect.y, rect.width, rect.height);
  }

  public drawCircle(x: number, y: number, radius: number) {
    this.pixi.drawCircle(x, y, radius);
  }


  protected async _destroy() {
    this.pixi.destroy();
  }

}