import {Component} from "./Component";
import GameObject from "../gameobjects/GameObject";
import { Cursor } from "pixi.js";
import {ChibiEvent} from "../event/ChibiEvent";

export default class Interactivity extends Component<"interactivity", GameObject> {
  public readonly componentName = "interactivity";

  private cursor: Cursor = "default";

  private target: GameObject;

  public onClick: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onRightClick: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onRightDown: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onRightUp: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onTap: ChibiEvent<[MouseEvent]> = new ChibiEvent();

  public onWheel: ChibiEvent<[WheelEvent]> = new ChibiEvent();

  public onMouseDown: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onMouseUp: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onMouseMove: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onMouseOver: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onMouseLeave: ChibiEvent<[MouseEvent]> = new ChibiEvent();
  public onMouseEnter: ChibiEvent<[MouseEvent]> = new ChibiEvent();

  public onPointerDown: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerUp: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerTap: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerMove: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerOver: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerEnter: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerLeave: ChibiEvent<[PointerEvent]> = new ChibiEvent();
  public onPointerCancel: ChibiEvent<[PointerEvent]> = new ChibiEvent();

  public onTouchStart: ChibiEvent<[TouchEvent]> = new ChibiEvent();
  public onTouchEnd: ChibiEvent<[TouchEvent]> = new ChibiEvent();
  public onTouchEndOutside: ChibiEvent<[TouchEvent]> = new ChibiEvent();
  public onTouchMove: ChibiEvent<[TouchEvent]> = new ChibiEvent();
  public onTouchCancel: ChibiEvent<[TouchEvent]> = new ChibiEvent();


  public constructor() {
    super();
  }

  public async preApply(target: GameObject) {
    await super.preApply(target);

    this.target = target;

    target.pixi.eventMode = "static";
    target.pixi.cursor = this.cursor;

    this.bindEvent("pointerdown", this.onPointerDown);
    this.bindEvent("pointerup", this.onPointerUp);
    this.bindEvent("pointertap", this.onPointerTap);
    this.bindEvent("pointermove", this.onPointerMove);
    this.bindEvent("pointerover", this.onPointerOver);
    this.bindEvent("pointerenter", this.onPointerEnter);
    this.bindEvent("pointerleave", this.onPointerLeave);
    this.bindEvent("pointercancel", this.onPointerCancel);

    this.bindEvent("touchstart", this.onTouchStart);
    this.bindEvent("touchend", this.onTouchEnd);
    this.bindEvent("touchendoutside", this.onTouchEndOutside);
    this.bindEvent("touchmove", this.onTouchMove);
    this.bindEvent("touchcancel", this.onTouchCancel);

    this.bindEvent("mousedown", this.onMouseDown);
    this.bindEvent("mouseup", this.onMouseUp);
    this.bindEvent("mousemove", this.onMouseMove);
    this.bindEvent("mouseover", this.onMouseOver);
    this.bindEvent("mouseleave", this.onMouseLeave);
    this.bindEvent("mouseenter", this.onMouseEnter);

    this.bindEvent("click", this.onClick);
    this.bindEvent("rightclick", this.onRightClick);
    this.bindEvent("rightdown", this.onRightDown);
    this.bindEvent("rightup", this.onRightUp);
    this.bindEvent("wheel", this.onWheel);

    this.bindEvent("tap", this.onTap);
  }

  public setCursor(cursor: Cursor): this {
    this.cursor = cursor;

    if(this.target) {
      this.target.pixi.cursor = cursor;
    }

    return this;
  }

  private bindEvent(eventName: string, event: ChibiEvent<[any]>) {
    // Add the listener lazily
    if(event.listeners.length > 0) {
      this.target.pixi.on(eventName, event.trigger.bind(event));
    } else {
      event.onAddListener.subscribeOnce(() => {
        this.target.pixi.on(eventName, event.trigger.bind(event));
      });
    }
  }

}