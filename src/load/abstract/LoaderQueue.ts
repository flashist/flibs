import {AssociativeArray} from "fcore";

import {AbstractLoadItem} from "./item/AbstractLoadItem";
import {ILoadItemConfig} from "./item/ILoadItemConfig";
import {LoadTools} from "../tools/LoadTools";

export class LoaderQueue {

    public items: AssociativeArray<AbstractLoadItem> = new AssociativeArray<AbstractLoadItem>();
    public itemsToLoad: AssociativeArray<AbstractLoadItem> = new AssociativeArray<AbstractLoadItem>();
    public loadedItems: AssociativeArray<AbstractLoadItem> = new AssociativeArray<AbstractLoadItem>();

    protected isNeedSort:boolean;

    public add(item: AbstractLoadItem): void {
        this.isNeedSort = true;

        this.items.push(
            item,
            LoadTools.getUniqueLoadingId(item.config)
        );
        this.itemsToLoad.push(
            item,
            LoadTools.getUniqueLoadingId(item.config)
        );
    }

    public get(config: ILoadItemConfig): AbstractLoadItem {
        const tempId: string = LoadTools.getUniqueLoadingId(config);
        return this.items.getItem(tempId);
    }

    public getNextToLoad(): AbstractLoadItem {
        if (this.isNeedSort) {
            this.sortItems();
        }

        return this.itemsToLoad.getItemByIndex(0);
    }

    protected sortItems(): void {
        this.itemsToLoad.sort(
            (item1: AbstractLoadItem, item2: AbstractLoadItem): number => {
                let result: number = 0;

                if (item1.config.priority && item2.config.priority) {
                    if (item1.config.priority > item2.config.priority) {
                        result = -1;
                    } else if (item1.config.priority < item2.config.priority) {
                        result = 1;
                    }
                }

                return result;
            }
        );
    }

    public onItemLoad(item: AbstractLoadItem): void {
        if (this.items.indexOf(item) === -1) {
            return;
        }

        this.itemsToLoad.remove(item);
        this.loadedItems.push(item, LoadTools.getUniqueLoadingId(item.config));
    }
}