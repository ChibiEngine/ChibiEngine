import Component from "../../engine/component/Component";
import GameObject from "../../engine/gameobjects/GameObject";
import Event from "../../engine/event/Event";

export default class Damageable extends Component<GameObject> {
  public readonly name = "damageable";

  targetType = GameObject;

  public readonly onDeath = new Event<void>();

  private _health: number = 10;

  public get health(): number {
    return this._health;
  }

  public set health(health: number) {
    this._health = health;
    if(this._health <= 0) {
      this._health = 0;
      this.onDeath.trigger(null);
    }
  }

  public damage(amount: number) {
    this._health -= amount;
    if(this._health <= 0) {
      this._health = 0;
      this.onDeath.trigger(null);
    }
  }
}