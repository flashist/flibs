import { Loader } from "pixi.js";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
export declare class PixiImageLoadItem extends AbstractLoadItem {
    protected loader: Loader;
    protected progressBinding: any;
    protected fileCompleteBinding: any;
    protected completeBinding: any;
    protected errorBinding: any;
    protected internalPrepare(): void;
    protected internalStart(): void;
    protected internalStop(): void;
    protected addLoadingListeners(): void;
    protected removeLoadingListeners(): void;
}
