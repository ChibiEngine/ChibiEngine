import Size from "./Size";

export default function half(of: Size) {
  const size = new Size();
  function update() {
    size.set(of.width / 2, of.height / 2);
  }
  update();
  of.onChange.subscribe(update);
  return size;
}
