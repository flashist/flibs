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

    normalize(length: number = 1): void {
        var magnitude: number = Math.sqrt(this.x * this.x + this.y * this.y);
        if (magnitude != 0) {
            this.x *= length / magnitude;
            this.y *= length / magnitude;
        }
    }
};
