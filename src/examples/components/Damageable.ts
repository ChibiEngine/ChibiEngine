import Component from "../../engine/component/Component";
import Event from "../../engine/event/Event";

export default class Damageable extends Component<"damageable"> {
  public readonly name = "damageable";

  public readonly onDeath = new Event<void>();

  private _health: number;

  constructor(health: number = 10) {
    super();
    this._health = health;
  }

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