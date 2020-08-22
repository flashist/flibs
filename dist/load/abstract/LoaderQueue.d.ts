import { AssociativeArray } from "fcore";
import { AbstractLoadItem } from "./item/AbstractLoadItem";
import { ILoadItemConfig } from "./item/ILoadItemConfig";
export declare class LoaderQueue {
    items: AssociativeArray<AbstractLoadItem>;
    itemsToLoad: AssociativeArray<AbstractLoadItem>;
    loadedItems: AssociativeArray<AbstractLoadItem>;
    protected isNeedSort: boolean;
    add(item: AbstractLoadItem): void;
    get(config: ILoadItemConfig): AbstractLoadItem;
    getNextToLoad(): AbstractLoadItem;
    protected sortItems(): void;
    onItemLoad(item: AbstractLoadItem): void;
}
