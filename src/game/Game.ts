import { Application, Container as PixiContainer } from "pixi.js";

import Scene from "./Scene";
import Container from "../gameobjects/Container";
import Rectangle from "../geom/rect/Rectangle";
import GameLoop from "./GameLoop";
import {Event} from "../event/Event";

interface GameConfig {
  width: number;
  height: number;
  backgroundColor: number;
  resolution: number;
}

export default class Game extends Container {
  public pixi: PixiContainer = null;

  private _pixiApp: Application;
  private readonly sceneStack: Scene[] = [];

  private readonly gameLoop: GameLoop = new GameLoop();

  public screen: Rectangle;

  private onStart: Event<this> = new Event();

  public constructor(public readonly config: GameConfig) {
    super();
  }

  public async start(canvas?: HTMLCanvasElement | string) {
    this._pixiApp = new Application( {
      ...this.config,
      view: typeof canvas === "string" ? document.getElementById(canvas) as HTMLCanvasElement : canvas,
    });

    if(typeof canvas === "undefined") {
      document.body.appendChild(this._pixiApp.view as HTMLCanvasElement);
    }

    this.pixi = this._pixiApp.stage;
    this.screen = new Rectangle(this._pixiApp.screen.x, this._pixiApp.screen.y, this._pixiApp.screen.width, this._pixiApp.screen.height);

    this._pixiApp.renderer.on("resize", () => {
      this.screen.set(this._pixiApp.screen.x, this._pixiApp.screen.y, this._pixiApp.screen.width, this._pixiApp.screen.height);
    });

    this._pixiApp.ticker.destroy();

    await this._create();

    this.onStart.trigger(this);

    this.gameLoop.start(this.updateScenes.bind(this));
  }

  public get pixiApp(): Application {
    return this._pixiApp;
  }

  /**
   * To override
   */
  public async _create() {
    // To override
  }

  /**
   * To be overridden
   */
  public async _destroy() {
    // To override
  }

  // TODO : override add to use a default scene if none is present

  public currentScene(): Scene {
    if (this.sceneStack.length === 0) return null;
    return this.sceneStack[this.sceneStack.length - 1];
  }

  public get scene(): Scene {
    return this.currentScene();
  }

  public addScene(scene: Scene, id?: string) {
    scene.game = this;
    this.sceneStack.push(scene);
    this.onStart.subscribeOnce(() => {
      this.add(scene, id);
    }).triggerNowIfValueExists();
  }

  private updateScenes(time: number, dt: number) {
    for (const scene of this.sceneStack) {
      scene.updateScene(time, dt);
    }
    this._pixiApp.render();
  }
}
