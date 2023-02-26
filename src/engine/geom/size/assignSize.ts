import Size from "./Size";

export default function assignSize(obj: {width: number, height: number}, size: Size) {
    if(!obj) {
        return;
    }
    function update() {
        obj.width = size.width;
        obj.height = size.height;
    }
    update();
    size.onChange.subscribe(update);
}