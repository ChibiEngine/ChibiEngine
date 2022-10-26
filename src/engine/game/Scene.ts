import Camera from "../camera/Camera";
import Node from "../node/Node";
import Game from "./Game";

export default class Scene extends Node {
  public game: Game;
  private camera: Camera;

  public update(delta: number) {

  }
}
