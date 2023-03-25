import Action from "./Action";
import Sprite from "../gameobjects/Sprite";
import Container from "../gameobjects/Container";

export default class ContainerSpecific extends Action<Container> {
  _run(target: Container): void {
  }

  _update(offset: number, target: Container): void {
  }
}