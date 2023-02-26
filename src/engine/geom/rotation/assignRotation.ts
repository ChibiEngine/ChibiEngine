import Rotation from "./Rotation";

export default function assignRotation(obj: {rotation: number}, rotation: Rotation) {
    if(!obj) {
        return;
    }
    function update() {
        obj.rotation = rotation.radians;
    }
    update();
    rotation.onChange.subscribe(update);
}