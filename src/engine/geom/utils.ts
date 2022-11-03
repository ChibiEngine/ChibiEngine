import Position from "./position/Position";

export function assignPosition(obj: {x: number, y: number}, position: Position) {
    if(!obj) {
        return;
    }
    function update() {
        obj.x = position.x;
        obj.y = position.y;
    }
    update();
    position.onChange.subscribe(update);
}