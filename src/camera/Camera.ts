import Container from "../gameobjects/Container";
import Scene from "../game/Scene";
import GameObject from "../gameobjects/GameObject";
import {VariableUpdatable} from "../gameobjects/Updatable";
import ConstrainedPosition from "../component/ConstrainedPosition";
import Linear from "../math/easing/Linear";

export default class Camera extends Container.With(ConstrainedPosition) implements VariableUpdatable {
  public readonly updateCallOrder = 1;

  private readonly _offset = {x: 0, y: 0};
  private readonly _lerp = {x: 1, y: 1};

  private following: GameObject;

  public constructor() {
    super(new ConstrainedPosition(0, 0));
  }

  protected async _create(): Promise<void> {
    const scene = this.scene as Scene;

    this.position.onChange(pos => {
      // TODO : use scene size instead of screen size
      const width = scene.game.screen.width/2;
      const height = scene.game.screen.height/2;

      let x = -pos.x + width + this._offset.x;
      let y = -pos.y + height + this._offset.y;

      for(const layer of scene.layers) {
        const scrollFactor = layer.scrollFactor;
        layer.position.set(x*scrollFactor.x, y*scrollFactor.y);
      }
    });
  }

  public setOffset(x: number, y: number) {
    this._offset.x = x;
    this._offset.y = y;

    return this;
  }

  public setLerp(x: number, y: number = x) {
    this._lerp.x = x;
    this._lerp.y = y;

    return this;
  }

  public setBounds(x1: number, y1: number, x2: number, y2: number) {
    this.position.setPositionBounds(x1+this.scene.game.screen.width/2,
        y1+this.scene.game.screen.height/2,
        x2-this.scene.game.screen.width/2,
        y2-this.scene.game.screen.height/2
    );

    return this;
  }

  public follow(target: GameObject) {
    this.following = target;
    this.position.set(target.x, target.y);

    return this;
  }

  public variableUpdate(dt: number) {
    if(this.following && this.following.position) {
      const pos = this.position;
      const targetPos = this.following.position;

      // TODO : PB : lerp is dependant on the frame rate
      // Possible fix : this._lerp.x / (16.66/dt)
      this.position.set(
          Linear.INSTANCE.interpolate(pos.x, targetPos.x, this._lerp.x),
          Linear.INSTANCE.interpolate(pos.y, targetPos.y, this._lerp.y)
      );
    }
  }
}
