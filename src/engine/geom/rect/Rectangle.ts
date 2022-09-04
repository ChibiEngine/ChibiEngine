import Sizeable from "../size/Sizeable";
import Positionable from "../position/Positionable";
import Event from "../../event/Event";
import Size from "../size/Size";
import Position from "../position/Position";
import center from "../../node/positioning/center";

export default class Rectangle implements Sizeable, Positionable {
    public readonly position: Position;
    public readonly size: Size;

    public readonly onSizeChange: Event<Size>;
    public readonly onPositionChange: Event<Position>;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = new Position(x, y);
        this.size = new Size(width, height);
        this.onPositionChange = this.position.onChange;
        this.onSizeChange = this.size.onChange;
    }

    public get center() {
        return center(this);
    }

    public get x() {
        return this.position.x;
    }

    public get y() {
        return this.position.y;
    }

    public get width() {
        return this.size.width;
    }

    public get height() {
        return this.size.height;
    }
};