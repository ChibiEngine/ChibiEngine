import Camera from "./camera/Camera";
import Game from "./Game";
import Node from "./node/Node";
import INode from "./node/INode";
import Resource from "./resource/Resource";

export class Scene extends Node {
  game: Game = null;

  private camera: Camera;
}
