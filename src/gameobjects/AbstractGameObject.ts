import Component, {AbstractComponent} from "../component/Component";

import Loadable from "../loader/Loadable";

import type Scene from "../game/Scene";
import Updatable, {isUpdatable} from "./Updatable";
import assignComponent from "./operations/assignComponent";
import {ComponentProperties} from "../component/types/ComponentProperty";
import Mixin, {ClassArrayType, ClassArrayTypeOmit, Mixed} from "../mixin/Mixin";
import {Class, ComponentClass, UnionToIntersection} from "../utils/type_utils";

// Inspired by https://docs.cocos2d-x.org/api-ref/cplusplus/v4x/d3/d82/classcocos2d_1_1_node.html

export default abstract class AbstractGameObject extends Loadable {
  type = "gameobject";
  protected components: Component<string, any>[] = [];
  protected updatableComponentsToAdd: (Component<string, any> & Updatable)[] = [];

  protected created = false;

  private _scene: Scene;

  public constructor() {
    super();
  }

  //////////////////////

  public get scene() {
    return this._scene;
  }

  public set scene(scene: Scene) {
    this._scene = scene;
    for(const component of this.updatableComponentsToAdd) {
      this._scene.addUpdatable(component);
    }
    this.updatableComponentsToAdd.length = 0;
  }

  //// COMPONENTS ////

  public addComponent<C extends Component<string, this>>(component: C) {
    this.components.push(component);
    if(this.created) {
      component.apply(this);
    }
    if (isUpdatable(component) && !component.dontAddToUpdateList) {
      if(this.scene?.initialized) {
        this.scene.addUpdatable(component);
      } else {
        this.updatableComponentsToAdd.push(component);
      }
    }
    return assignComponent(this, component);
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
