import Camera from "../camera/Camera";
import Node from "../node/Node";
import Game from "./Game";

export default class Scene extends Node {
  game: Game = null;

  private camera: Camera;
}
