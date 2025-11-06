import Sizeable from "../size/Sizeable";
import Positionable from "../position/Positionable";
import {ChibiEvent} from "../../event/ChibiEvent";
import center from "../../gameobjects/positioning/center";
import Position from "../../component/Position";
import Size from "../size/Size";
import ISize from "../size/ISize";
import IPosition from "../position/IPosition";
import IBounds from "./IBounds";

export default class Rectangle implements Sizeable, Positionable {
    public readonly position: Position;
    public readonly size: Size;

    public readonly onSizeChange: ChibiEvent<[ISize]>;
    public readonly onPositionChange: ChibiEvent<[IPosition]>;

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

    public get x1() {
        return this.x;
    }

    public get y1() {
        return this.y;
    }

    public get x2() {
        return this.x + this.width;
    }

    public get y2() {
        return this.y + this.height;
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

    public toBounds(): IBounds {
        return {
            x1: this.x1,
            y1: this.y1,
            x2: this.x2,
            y2: this.y2
        };
    }

    public static fromBounds(bounds: IBounds): Rectangle {
        return new Rectangle(bounds.x1, bounds.y1, bounds.x2 - bounds.x1, bounds.y2 - bounds.y1);
    }
};