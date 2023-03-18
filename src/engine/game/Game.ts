import * as PIXI from "pixi.js";
import Scene from "./Scene";
import Container from "../gameobjects/Container";
import Rectangle from "../geom/rect/Rectangle";
import GameLoop from "./GameLoop";

interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
  resolution: number;
}

export default class Game extends Container {
  public readonly _internal: PIXI.Container = null;

  private readonly app: PIXI.Application;
  private readonly sceneStack: Scene[] = [];

  private readonly gameLoop: GameLoop = new GameLoop();

  public readonly screen: Rectangle;

  public constructor(config: GameConfig) {
    super();
    this.app = new PIXI.Application(config);
    document.body.appendChild(this.app.view);
    this._internal = this.app.stage;
    this.gameLoop.start(this.updateScenes.bind(this));
    this.screen = new Rectangle(this.app.screen.x, this.app.screen.y, this.app.screen.width, this.app.screen.height);
    this.app.renderer.on("resize", () => {
      this.screen.set(this.app.screen.x, this.app.screen.y, this.app.screen.width, this.app.screen.height);
    });
  }

  /**
   * To be overridden
   */
  public async _create() { }

  /**
   * To be overridden
   */
  public async _destroy() { }

  public currentScene(): Scene {
    if (this.sceneStack.length === 0) return null;
    return this.sceneStack[this.sceneStack.length - 1];
  }

  public addScene(scene: Scene) {
    scene.game = this;
    this.add(scene).then(() => {
      this.sceneStack.push(scene);
    });
  }

  private updateScenes(time: number, dt: number) {
    for (const scene of this.sceneStack) {
      scene.updateScene(time, dt);
    }
  }
}
