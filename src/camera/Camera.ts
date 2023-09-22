import Container from "../gameobjects/Container";
import Scene from "../game/Scene";
import GameObject from "../gameobjects/GameObject";
import Rectangle from "../geom/rect/Rectangle";
import {VariableUpdatable} from "../gameobjects/Updatable";

export default class Camera extends Container implements VariableUpdatable {
  dontAddToUpdateList = true;

  private readonly _offset = {x: 0, y: 0};
  private _bounds: Rectangle = undefined;

  private following: GameObject;

  public constructor() {
    super();
  }

  protected async _create(): Promise<void> {
    const scene = this.scene as Scene;

    this.position.onChange(pos => {
      // TODO : use scene size instead of screen size
      const width = scene.game.screen.width/2;
      const height = scene.game.screen.height/2;

      let x = -pos.x + width + this._offset.x;
      let y = -pos.y + height + this._offset.y;

      if(this._bounds) {
        if(pos.x-width < this._bounds.left) {
          x = -this._bounds.left;
        } else if(pos.x + width > this._bounds.right) {
          x = -(this._bounds.right - width*2);
        }

        if(pos.y-height < this._bounds.top) {
          y = -this._bounds.top;
        } else if(pos.y + height > this._bounds.bottom) {
          y = -(this._bounds.bottom - height*2);
        }
      }

      for(const layer of scene.layers) {
        const scrollFactor = layer.scrollFactor;
        layer.position.set(x*scrollFactor.x, y*scrollFactor.y);
        // layer.position.set(x, y);
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
    this.following = target;
    this.position.set(target.x, target.y);

    this.scene.removeUpdatable(this);

    // To be sure that this Updatable is called after the target's position one :
    target.whenLoaded(() => {
      this.scene.addUpdatable(this);
    });

    // Alternative with onExactValueChange event in TransitionableComponent
    // target.position.onExactValueChange(pos => {
    //   this.position.set(pos.x, pos.y);
    // });

    return this;
  }

  public variableUpdate(dt: number) {
    if(this.following && this.following.position.exactValue) {
      this.setPosition(this.following.position.exactValue.x, this.following.position.exactValue.y);
    }
  }
}
