import Image from "../resource/Image";
import GameObject from "./GameObject";
import Position from "../geom/position/Position";
import assignPosition from "../geom/position/assignPosition";
import SpriteComponent from "../component/SpriteComponent";

export default class Sprite extends GameObject.With(SpriteComponent) {
  public _internal: SpriteComponent;

  public constructor(private readonly image: Image, x: number = 0, y: number = 0) {
    super(new Position(x, y));
    // console.log(Object.getPrototypeOf(this));
    this._internal = new SpriteComponent();
    this.addComponent(this._internal);
  }

  public async _create(): Promise<void> {
    // Load Texture
    // TODO: syntaxe bizarre, on s'attendrait à juste faire `const image = await this.load(this.image)` sans le .loaded
    //
    const image = await this.load(this.image);
    this._internal.texture = image.texture;
    assignPosition(this._internal, this.position);
  }

  public async _destroy() {
    this._internal.destroy();
    // image auto release in Loadable
  }
}
