import Component from "./Component";
import GameObject from "../gameobjects/GameObject";
import { Cursor } from "pixi.js";
import Event from "../event/Event";

export default class Interactivity extends Component<"interactivity", GameObject> {
  public readonly componentName = "interactivity";

  private cursor: Cursor = "default";

  private target: GameObject;

  public onClick: Event<MouseEvent> = new Event();
  public onRightClick: Event<MouseEvent> = new Event();
  public onRightDown: Event<MouseEvent> = new Event();
  public onRightUp: Event<MouseEvent> = new Event();
  public onTap: Event<MouseEvent> = new Event();

  public onWheel: Event<WheelEvent> = new Event();

  public onMouseDown: Event<MouseEvent> = new Event();
  public onMouseUp: Event<MouseEvent> = new Event();
  public onMouseMove: Event<MouseEvent> = new Event();
  public onMouseOver: Event<MouseEvent> = new Event();
  public onMouseLeave: Event<MouseEvent> = new Event();
  public onMouseEnter: Event<MouseEvent> = new Event();

  public onPointerDown: Event<PointerEvent> = new Event();
  public onPointerUp: Event<PointerEvent> = new Event();
  public onPointerTap: Event<PointerEvent> = new Event();
  public onPointerMove: Event<PointerEvent> = new Event();
  public onPointerOver: Event<PointerEvent> = new Event();
  public onPointerEnter: Event<PointerEvent> = new Event();
  public onPointerLeave: Event<PointerEvent> = new Event();
  public onPointerCancel: Event<PointerEvent> = new Event();

  public onTouchStart: Event<TouchEvent> = new Event();
  public onTouchEnd: Event<TouchEvent> = new Event();
  public onTouchEndOutside: Event<TouchEvent> = new Event();
  public onTouchMove: Event<TouchEvent> = new Event();
  public onTouchCancel: Event<TouchEvent> = new Event();


  public constructor() {
    super();
  }

  public apply(target: GameObject) {
    super.apply(target);

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

  private bindEvent(eventName: string, event: Event<any>) {
    // Add the listener lazily
    event.onAddListener.subscribeOnce(() => {
      this.target.pixi.on(eventName, (e) => {
        event.trigger(event);
      });
    }).triggerNowIfValue();
  }

}