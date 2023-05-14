import Component, {AbstractComponent} from "../component/Component";

import Loadable from "../loader/Loadable";

import type Scene from "../game/Scene";
import {isUpdatable} from "./Updatable";
import assignComponent from "./operations/assignComponent";
import {ComponentProperties} from "../component/types/ComponentProperty";
import Mixin, {ClassArrayType, ClassArrayTypeOmit, Mixed} from "../mixin/Mixin";
import {Class, ComponentClass, UnionToIntersection} from "../utils/type_utils";

// Inspired by https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/d3/d82/classcocos2d_1_1_node.html

export default abstract class AbstractGameObject extends Loadable {
  type = "gameobject";
  protected components: Component<string, any>[] = [];

  protected created = false;

  public constructor() {
    super();
  }

  //////////////////////

  public abstract get scene(): Scene;

  //// COMPONENTS ////

  public addComponent<C extends Component<string, this>>(component: C, assign: boolean = true) {
    this.components.push(component);
    if(this.created) {
      component.apply(this);
    }
    if (isUpdatable(component) && this.scene?.initialized) {
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

  public static With<T extends abstract new (...args: any) => any, A extends Array<Class<AbstractComponent<string, InstanceType<T> & UnionToIntersection<ClassArrayType<A>>>>>>(this: T, ...classes: A):
      ComponentClass<T, InstanceType<T> & UnionToIntersection<ClassArrayTypeOmit<A, "componentName">> & ComponentProperties<A> & Mixed> & {With: typeof AbstractGameObject.With} {
    return Mixin(this, ...classes) as any;
  }
}
