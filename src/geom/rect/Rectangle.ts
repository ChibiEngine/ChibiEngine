import Sizeable from "../size/Sizeable";
import Positionable from "../position/Positionable";
import {ChibiEvent} from "../../event/ChibiEvent";
import center from "../../gameobjects/positioning/center";
import Position from "../../component/Position";
import Size from "../size/Size";
import ISize from "../size/ISize";

export default class Rectangle implements Sizeable, Positionable {
    public readonly position: Position;
    public readonly size: Size;

    public readonly onSizeChange: ChibiEvent<ISize>;
    public readonly onPositionChange: ChibiEvent<Position>;

    constructor(x: number, y: number, width: number, height: number) {
        this.position = new Position(x, y);
        this.size = new Size(width, height);
        this.onPositionChange = this.position.onChange;
        this.onSizeChange = this.size.onChange;
    }

    public set(x: number, y: number, width: number, height: number) {
        this.position.set(x, y);
        this.size.set(width, height);
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

    public get left() {
        return this.x;
    }

    public get right() {
        return this.x + this.width;
    }

    public get top() {
        return this.y;
    }

    public get bottom() {
        return this.y + this.height;
    }
};