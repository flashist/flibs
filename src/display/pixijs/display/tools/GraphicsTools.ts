import { Graphics } from "../../../../../index";

export class GraphicsTools {
    static createTraspRect(x: number = 0, y: number = 0, width: number = 10, height: number = 10): Graphics {
        const result: Graphics = new Graphics();
        result.rect(x, y, width, height);
        // Non-zero value is needed for clickable graphics (but in practice it will be 100% transparent)
        result.fill({ color: 0x000000, alpha: 0.001 });

        result.alpha = 0;

        return result;
    }
}