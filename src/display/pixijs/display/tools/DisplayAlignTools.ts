import { Align, DisplayObjectContainer, VAlign } from "../../../../index";

export class DisplayAlignTools {
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

    public static valignWith(object: DisplayObjectContainer, valignWith: DisplayObjectContainer, valign: VAlign, floorPixels: boolean = true): void {
        let newY: number = valignWith.y;

        switch (valign) {
            case VAlign.MIDDLE:
                newY = valignWith.y + ((valignWith.height - object.height) * 0.5);
                break;
            case VAlign.BOTTOM:
                newY = valignWith.y + (valignWith.height - object.height);
                break;
        }

        if (floorPixels) {
            newY = Math.floor(newY);
        }

        object.y = newY;
    }
}