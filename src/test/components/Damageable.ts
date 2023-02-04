import Component from "../../engine/component/Component";
import GameObject from "../../engine/gameobjects/GameObject";
import Event from "../../engine/event/Event";

export default class Damageable extends Component<GameObject> {
  targetType = GameObject;

  public readonly onDeath = new Event<void>();

  private _health: number = 100;

  public get health(): number {
    return this._health;
  }

  public damage(amount: number) {
    this._health -= amount;
    if(this._health <= 0) {
      this._health = 0;
      this.onDeath.trigger(null);
    }
  }
}