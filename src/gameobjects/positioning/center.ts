import Positionable from "../../geom/position/Positionable";
import Sizeable from "../../geom/size/Sizeable";
import Position from "../../component/Position";

export default function center(on: Positionable & Sizeable) {
  const position = Position.zero();
  function update() {
    position.set(on.x + on.width / 2, on.y + on.height / 2);
  }
  update();
  on.onPositionChange.subscribe(update);
  on.onSizeChange.subscribe(update);
  return position;
}
