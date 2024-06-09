import GameObject from "../gameobjects/GameObject";
import AbstractGameObject from "../gameobjects/AbstractGameObject";

export abstract class AbstractComponent<Name extends string, in T extends AbstractGameObject = AbstractGameObject> {
  public abstract readonly componentName: Name;

  public gameobject: this;

  /**
   * To override.
   * Called when the component is added to a gameobject.
   * @param target
   */
  public setTarget(target: T): void {
    // To override
  }

  /**
   * To override.
   * Called when the gameobject is loaded and ready to apply the component.
   * @param target
   */
  public apply(target: T): void {
    // To override
  }

  // Alternative to contravariance that may be broken https://github.com/microsoft/TypeScript/issues/53798
  // #invariantStructuralHint = undefined as unknown as (x: T) => void
}

/*
    Component<GameObject> is assignable to Component<Sprite>
    because Sprite extends GameObject, something that is applicable to a GameObject is applicable to a Sprite
    => contravariance
*/
export default abstract class Component<Name extends string, in T extends AbstractGameObject = GameObject> extends AbstractComponent<Name, T> {

}