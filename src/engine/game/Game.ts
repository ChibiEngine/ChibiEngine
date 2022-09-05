import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Resource from "../resource/Resource";
import Node from "../node/Node";
import DefaultLoader from "../loader/DefaultLoader";
import Loader from "../loader/Loader";
import Rectangle from "../geom/rect/Rectangle";
import Loadable from "../loader/Loadable";

interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
  resolution: number;
}

export default class Game extends Node {
  public readonly _internal: PIXI.Container = null;

  private readonly app: PIXI.Application;
  private readonly sceneStack: Scene[] = [];

  public readonly loader: Loader = new DefaultLoader();

  public constructor(config: GameConfig) {
    super();
    this.app = new PIXI.Application(config);
    document.body.appendChild(this.app.view);
    this._internal = this.app.stage;
  }

  public get screen(): Rectangle {
    return new Rectangle(this.app.screen.x, this.app.screen.y, this.app.screen.width, this.app.screen.height);
  }

  public load<T extends Loadable>(dependency: T): T {
    if(dependency instanceof Resource) {
      return this.loader.load(dependency);
    }else{
      return super.load(dependency);
    }
  }

  /**
   * To be overridden
   */
  public async create() { }

  /**
   * To be overridden
   */
  public destroy() { }

  public currentScene(): Scene {
    if (this.sceneStack.length === 0) return null;
    return this.sceneStack[this.sceneStack.length - 1];
  }

  public addScene(scene: Scene) {
    scene.game = this;
    this.add(scene);
    this.sceneStack.push(scene);
    this.updateScene();
  }

  private updateScene() {
    // TODO: implement
  }
}
