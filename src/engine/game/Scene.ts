import Camera from "../camera/Camera";
import Node from "../node/Node";
import Game from "./Game";
import Updatable from "../node/Updatable";

export default abstract class Scene extends Node implements Updatable {
  public game: Game;
  private camera: Camera;

  private readonly updateList: Updatable[] = [];

  public get scene() {
    return this;
  }

  public update(delta: number) {
    for (const updatable of this.updateList) {
      updatable.update(delta);
    }
    this._update(delta);
  }

  protected abstract _update(delta: number): void;

  public addUpdatable(param: Updatable) {
    this.updateList.push(param);
  }
}
