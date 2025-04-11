import { DisplayObjectContainer, Container, Align } from "../../../../index";

export class DisplayTools {
    public static alignWith(object: DisplayObjectContainer, alignWith: DisplayObjectContainer, align: Align, floorPixels: boolean = true): void {
        let newX: number = alignWith.x;

        switch (align) {
            case Align.CENTER:
                newX = alignWith.x + ((alignWith.width - object.width) * 0.5);
                break;
            case Align.RIGHT:
                newX = alignWith.x + (alignWith.width - object.width);
                break;
        }

        if (floorPixels) {
            newX = Math.floor(newX);
        }

        object.x = newX;
    }
}