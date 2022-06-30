import * as PIXI from "pixi.js";
import INode from "../node/INode";
import { Scene } from "./Scene";

interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
  resolution: number;
}

export default class Game extends INode {
  protected readonly internal: PIXI.Container = null;

  private readonly app: PIXI.Application;
  private readonly sceneStack: Scene[];

  public constructor(config: GameConfig) {
    super();
    this.app = new PIXI.Application(config);
    document.body.appendChild(this.app.view);
    this.internal = this.app.stage;
  }

  public async create() { }

  public destroy() { }

  public currentScene(): Scene {
    if (this.sceneStack.length === 0) return null;
    return this.sceneStack[this.sceneStack.length - 1];
  }

  public addScene(scene: Scene) {
    scene.game = this;
    this.sceneStack.push(scene);
    this.updateScene();
  }

  private updateScene() {}
}
