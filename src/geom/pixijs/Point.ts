import {Point as PixiPoint} from "pixi.js";
// import Point = PIXI.Point;
export class Point extends PixiPoint {
    subtract(point: Point): Point {
        return new Point(
        this.x - point.x,
        this.y - point.y
        )
    }

    add(point: Point): Point {
        return new Point(
            this.x + point.x,
            this.y + point.y
        )
    }
};
