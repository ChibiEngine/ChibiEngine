import Container from "../gameobjects/Container";
import Game from "./Game";
import {Updatable, FixedUpdatable, isFixedUpdatable, isUpdatable, isVariableUpdatable, VariableUpdatable} from "../gameobjects/Updatable";
import Layer from "../camera/Layer";
import type GameObject from "../gameobjects/GameObject";
import RelativeArray from "../utils/RelativeArray";
import type {Container as PixiContainer} from "pixi.js";
import PixiObject from "../gameobjects/PixiObject";

export default abstract class Scene extends Container {
  public game: Game;

  private readonly fixedUpdatableSet: RelativeArray<Set<FixedUpdatable>> = new RelativeArray();
  private readonly variableUpdatableSet: RelativeArray<Set<VariableUpdatable>> = new RelativeArray();

  public initialized: boolean = false;

  public readonly layers: Layer[] = [];

  constructor() {
    super();
    this.initialized = true;
    if(isUpdatable(this)) {
      this.addUpdatable(this);
    }
  }

  public add<T extends PixiContainer>(child: T, id?: string): PixiObject<T> & PromiseLike<PixiObject<T>>
  public add<T extends GameObject>(child: T, id?: string): T & PromiseLike<T>
  public add(child: PixiContainer | GameObject, id?: string): any {
    const child2 = super.add<any>(child, id) as GameObject;
    if(child2 instanceof Layer) {
      this.layers.push(child2);
    }

    return child2;
  }

  public updateScene(time: number, dt: number) {
    for (let updatables of this.fixedUpdatableSet) {
      for (let updatable of updatables) {
        this.fixedUpdate(updatable, time);
      }
    }
    for (let updatables of this.variableUpdatableSet) {
      for (let updatable of updatables) {
        updatable.variableUpdate(dt);
      }
    }
  }

  private fixedUpdate(updatable: FixedUpdatable, time: number) {
    const t1 = performance.now();
    const updateDt = 1000/updatable.updateRate;
    let interval = time - updatable.lastUpdateTime;
    while (interval >= updateDt) {
      updatable.update();
      updatable.lastUpdateTime += updateDt;
      interval -= updateDt;
    }
    updatable.lastUpdateTime += performance.now()-t1; // balancing
  }

  public addUpdatable(param: Updatable) {
    param.updateCallOrder = param.updateCallOrder || 0;
    if(isFixedUpdatable(param)) {
      if(param.updateRate === undefined) {
        param.updateRate = 50;
      }
      param.lastUpdateTime = performance.now();
      this.fixedUpdatableSet.getOrAdd(param.updateCallOrder, new Set()).add(param);
    }
    if(isVariableUpdatable(param)) {
      this.variableUpdatableSet.getOrAdd(param.updateCallOrder, new Set()).add(param);
    }
  }

  public removeUpdatable(param: Updatable) {
    param.updateCallOrder = param.updateCallOrder || 0;
    if(isFixedUpdatable(param)) {
      const set = this.fixedUpdatableSet.get(param.updateCallOrder);
      set?.delete(param);
    } else {
      const set = this.variableUpdatableSet.get(param.updateCallOrder);
      set?.delete(param);
    }
  }
}
