import { AbstractLoadFactory } from "../abstract/AbstractLoadFactory";
import { AbstractLoadItem } from "../abstract/item/AbstractLoadItem";
import { ILoadItemConfig } from "../abstract/item/ILoadItemConfig";
export declare class PreloadjsPixiLoadFactory extends AbstractLoadFactory {
    createItem(config: ILoadItemConfig): AbstractLoadItem;
}
