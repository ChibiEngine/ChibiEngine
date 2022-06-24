import * as PIXI from "pixi.js";
import { Scene } from "./Scene";

interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
  resolution: number;
}

export default class Game {
  private readonly app: PIXI.Application;
  private readonly sceneStack: Scene[];

  public constructor(config: GameConfig) {
    this.app = new PIXI.Application(config);
    document.body.appendChild(this.app.view);
  }

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
