import { ILoadItemConfig } from "./item/ILoadItemConfig";
import { AbstractLoadItem } from "./item/AbstractLoadItem";
export declare abstract class AbstractLoadFactory {
    static instance: AbstractLoadFactory;
    basePath: string;
    abstract createItem(config: ILoadItemConfig): AbstractLoadItem;
}
