import Camera from "../camera/Camera";
import Container from "../gameobjects/Container";
import Game from "./Game";
import Updatable, {FixedUpdatable, isFixedUpdatable, isUpdatable, isVariableUpdatable, VariableUpdatable} from "../gameobjects/Updatable";
import Layer from "../camera/Layer";

export default abstract class Scene extends Container {
  public game: Game;
  public readonly camera: Camera;

  private readonly fixedUpdatableSet: Set<FixedUpdatable> = new Set();
  private readonly variableUpdatableSet: Set<VariableUpdatable> = new Set();
  public initialized: boolean = false;

  private readonly layers: Layer[] = [];

  constructor() {
    super();
    this.initialized = true;
    if(isUpdatable(this)) {
      this.addUpdatable(this);
    }
    this.camera = new Camera(this);
    this.add(this.camera);
  }

  public get scene() {
    return this;
  }

  public updateScene(time: number, dt: number) {
    for (let updatable of this.fixedUpdatableSet) {
      this.fixedUpdate(updatable, time);
    }
    for (let updatable of this.variableUpdatableSet) {
      updatable.variableUpdate(dt);
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
    if(isFixedUpdatable(param)) {
      if(param.updateRate === undefined) {
        param.updateRate = 50;
      }
      param.lastUpdateTime = performance.now();
      this.fixedUpdatableSet.add(param);
    }
    if(isVariableUpdatable(param)) {
      this.variableUpdatableSet.add(param);
    }
  }

  public removeUpdatable(param: Updatable) {
    if(isFixedUpdatable(param)) {
      this.fixedUpdatableSet.delete(param);
    } else {
      this.variableUpdatableSet.delete(param);
    }
  }
}
