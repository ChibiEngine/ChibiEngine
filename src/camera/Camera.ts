import Container from "../gameobjects/Container";
import Scene from "../game/Scene";
import GameObject from "../gameobjects/GameObject";
import {VariableUpdatable} from "../gameobjects/Updatable";
import ConstrainedPosition from "../component/ConstrainedPosition";

export default class Camera extends Container.With(ConstrainedPosition) implements VariableUpdatable {
  dontAddToUpdateList = true;

  private readonly _offset = {x: 0, y: 0};

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
