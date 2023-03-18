import Camera from "../camera/Camera";
import Container from "../gameobjects/Container";
import Game from "./Game";
import UpdateLoopListener, {isUpdateLoopListener} from "../gameobjects/UpdateLoopListener";
import RenderLoopListener, {isRenderLoopListener} from "../gameobjects/RenderLoopListener";

export default abstract class Scene extends Container {
  public lastUpdateTime: number = performance.now();
  public game: Game;
  private camera: Camera;

  private readonly updateSet: Set<UpdateLoopListener> = new Set();
  private readonly renderableSet: Set<RenderLoopListener> = new Set();

  constructor() {
    super();
    if(isUpdateLoopListener(this)) {
      this.addUpdatable(this);
    }
    if(isRenderLoopListener(this)) {
      this.addRenderable(this);
    }
  }

  public get scene() {
    return this;
  }

  public updateScene(time: number, dt: number) {
    for (let updatable of this.updateSet) {
      this.updateUpdatable(updatable, time, dt);
    }
    for (let renderable of this.renderableSet) {
      renderable.render(dt);
    }
  }

  private updateUpdatable(updatable: UpdateLoopListener, time: number, dt: number) {
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

  public addUpdatable(param: UpdateLoopListener) {
    this.updateSet.add(param);
    param.lastUpdateTime = performance.now();
  }

  public removeUpdatable(param: UpdateLoopListener) {
    this.updateSet.delete(param);
  }

  public addRenderable(param: RenderLoopListener) {
    this.renderableSet.add(param);
  }

  public removeRenderable(param: RenderLoopListener) {
    this.renderableSet.delete(param);
  }
}
