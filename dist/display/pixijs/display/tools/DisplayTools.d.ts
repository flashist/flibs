import { DisplayObjectContainer, DisplayObject } from "../../../../index";
export declare class DisplayTools {
    static removeAllChildren(container: DisplayObjectContainer): void;
    static childRemoveItselfFromParent(child: DisplayObject): void;
    static moveObjectToTopLayer(object: DisplayObject): void;
    static safeAddChildAt(container: DisplayObjectContainer, child: DisplayObject, index: number): void;
}
