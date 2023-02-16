import {Graphics} from "../../../../index";

export class GraphicsTools {
    static createTraspRect(x: number = 0, y: number = 0, width: number = 10, height: number = 10): Graphics {
        const result: Graphics = new Graphics();
        result.beginFill(0x000000, 0.001);
        result.drawRect(x, y, width, height);
        result.alpha = 0;

        return result;
    }
}