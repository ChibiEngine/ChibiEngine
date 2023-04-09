import * as PIXI from "pixi.js";
import Component, {AbstractComponent} from "../component/Component";
import Event from "../event/Event";
import Position from "../geom/position/Position";

import Positionable from "../geom/position/Positionable";
import Size from "../geom/size/Size";
import Sizeable from "../geom/size/Sizeable";
import Loadable from "../loader/Loadable";
import center from "./positioning/center";

import type Container from "./Container";
import type Scene from "../game/Scene";
import Action from "../tween/Action";
import {isUpdatable, VariableUpdatable} from "./Updatable";
import assignPosition from "../geom/position/assignPosition";
import assignSize from "../geom/size/assignSize";
import Rotation from "../geom/rotation/Rotation";
import assignRotation from "../geom/rotation/assignRotation";
import assignComponent from "./operations/assignComponent";
import {ComponentProperties} from "../component/types/ComponentProperty";
import Mixin, {ClassArrayType, ClassArrayTypeOmit, Mixed} from "../mixin/Mixin";
import {Class, ComponentClass, UnionToIntersection} from "../utils/type_utils";
import GameObject from "./GameObject";

// Inspired by https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/d3/d82/classcocos2d_1_1_node.html

export default abstract class AbstractGameObject extends Loadable {
  type = "gameobject";
  private components: Component<string, any>[] = [];

  public constructor() {
    super();
  }

  //////////////////////

  public abstract get scene(): Scene;

  //// COMPONENTS ////

  public addComponent<C extends Component<string, this>>(component: C, assign: boolean = true) {
    this.components.push(component);
    component.apply(this);
    if (isUpdatable(component)) {
      this.scene.addUpdatable(component);
    }
    return assign && assignComponent(this, component);
  }

  public removeComponent(component: Component<string, this>) {
    const index = this.components.indexOf(component);
    if (index === -1) return false;
    this.components.splice(index, 1);
    if (isUpdatable(component)) {
      this.scene.removeUpdatable(component);
    }
  }

  public getComponent<T extends Component<string>>(type: Class<T>): T {
    for (const component of this.components) {
      if (component instanceof type) {
        return component;
      }
    }
    return null;
  }

  public static With<T extends abstract new (...args: any) => any, A extends Array<Class<AbstractComponent<string, InstanceType<T>>>>>(this: T, ...classes: A):
      ComponentClass<T, InstanceType<T> & UnionToIntersection<ClassArrayTypeOmit<A, "componentName">> & ComponentProperties<A> & Mixed> & {With: typeof AbstractGameObject.With} {
    return Mixin(this, ...classes) as any;
  }
}
