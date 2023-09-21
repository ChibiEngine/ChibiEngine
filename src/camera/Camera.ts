import Container from "../gameobjects/Container";
import Scene from "../game/Scene";
import GameObject from "../gameobjects/GameObject";
import Rectangle from "../geom/rect/Rectangle";

export default class Camera extends Container {
  private readonly _offset = {x: 0, y: 0};
  private _bounds: Rectangle = undefined;

  public constructor(scene: Scene) {
    super();

    this.position.onChange(pos => {
      // TODO : use scene size instead of screen size
      const width = scene.game.screen.width/2;
      const height = scene.game.screen.height/2;

      scene.x = -pos.x + width + this._offset.x;
      scene.y = -pos.y + height + this._offset.y;

      if(this._bounds) {
        if(pos.x-width < this._bounds.left) {
          scene.x = -this._bounds.left;
        } else if(pos.x + width > this._bounds.right) {
          scene.x = -(this._bounds.right - width*2);
        }

        if(pos.y-height < this._bounds.top) {
          scene.y = -this._bounds.top;
        } else if(pos.y + height > this._bounds.bottom) {
          scene.y = -(this._bounds.bottom - height*2);
        }
      }
    })
  }

  public setOffset(x: number, y: number) {
    this._offset.x = x;
    this._offset.y = y;

    return this;
  }

  public setBounds(x1: number, y1: number, x2: number, y2: number) {
    this._bounds = new Rectangle(x1, y1, x2-x1, y2-y1);

    return this;
  }

  public follow(target: GameObject) {
    this.position.set(target.x, target.y);
    target.position.onChange(pos => {
      this.position.set(pos.x, pos.y);
    });

    return this;
  }
}
