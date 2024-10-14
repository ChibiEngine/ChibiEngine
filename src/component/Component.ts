import GameObject from "../gameobjects/GameObject";
import AbstractGameObject from "../gameobjects/AbstractGameObject";

export abstract class AbstractComponent<Name extends string, in T extends AbstractGameObject = AbstractGameObject> {
  public abstract readonly componentName: Name;

  /**
   * If true, the component will be applied even if the gameobject is not created yet.
   */
  public immediateApply = false;

  /**
   * Reference to the gameobject that the component is attached to.
   */
  private _gameobject: any;

  public set gameobject(value: any) {
    this._gameobject = value;
  }

  /**
   * Get the gameobject that the component is attached to or the component itself if it is not attached to a gameobject.
   */
  public get gameobject(): this {
    return this._gameobject ?? this;
  }

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
  public async apply(target: T): Promise<void> {
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
export abstract class Component<Name extends string, in T extends AbstractGameObject = GameObject> extends AbstractComponent<Name, T> {

}