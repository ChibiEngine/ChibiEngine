import Camera from "./camera/Camera";
import Game from "./Game";
import Node from "./node/Node";
import INode from "./node/INode";
import Resource from "./resource/Resource";

export class Scene extends Node {
  game: Game = null;

  private camera: Camera;

  public constructor() {
    super();
  }

  public load<T extends INode | Resource<any>>(dependency: T): T {
    return null;
  }

  public add<T extends INode>(child: T): T {
    return null;
  }
}
