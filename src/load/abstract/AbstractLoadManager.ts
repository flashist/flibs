import {ObjectTools, StringTools, AssociativeArray, BaseObject} from "@flashist/fcore";

import {ILoadItemConfig} from "./item/ILoadItemConfig";
import {Loader} from "./Loader";
import {AbstractLoadItem} from "./item/AbstractLoadItem";
import {DefaultLoadItemConfig} from "./item/DefaultLoadItemConfig";
import {LoadGroup} from "./group/LoadGroup";
import {LoadStatusPriorityTools} from "./loadstatus/LoadStatusPriorityTools";
import {LoadStatus} from "./loadstatus/LoadStatus";

export abstract class AbstractLoadManager extends BaseObject {

    // protected defaultLoader: Loader = new Loader();
    // protected loadersToGroupMap: {[key:string]: Loader} = {};
    protected loadersToIdMap: AssociativeArray<Loader>;
    protected loadGroupsToNameMap: AssociativeArray<LoadGroup>;
    protected loadItemsToIdMap: AssociativeArray<AbstractLoadItem>;

    protected substituteUrlParams: object = {};

    protected construction(...args): void {
        super.construction(...args);

        this.loadersToIdMap = new AssociativeArray();
        this.loadGroupsToNameMap = new AssociativeArray();
        this.loadItemsToIdMap = new AssociativeArray();

        this.addLoader(new Loader(DefaultLoadItemConfig.DEFAULT_LOADER_ID));
    }

    public addLoader(loader: Loader): void {
        this.loadersToIdMap.push(loader, loader.id);
        // this.addLoaderListeners(loader);
    }

    protected getLoader(loaderId?: string): Loader {
        let result: Loader;
        if (loaderId) {
            result = this.loadersToIdMap.getItem(loaderId);
        }

        if (!result) {
            result = this.defaultLoader;
        }

        return result;
    }

    protected get defaultLoader(): Loader {
        return this.loadersToIdMap.getItem(DefaultLoadItemConfig.DEFAULT_LOADER_ID);
    }

    public getAllLoaders(): Loader[] {
        return this.loadersToIdMap.getAllItems().concat();
    }

    public load<DataType extends any = any>(itemConfig: ILoadItemConfig): AbstractLoadItem<DataType> {
        if (this.loadItemsToIdMap.getItem(itemConfig.id)) {
            console.warn("AbstractLoadManager | add __ WARNING! Item with the same id already exists. item:", itemConfig);
        }

        DefaultLoadItemConfig.addDefaultData(itemConfig);

        let tempLoader: Loader = this.getLoader(itemConfig.loader);

        const loadItem: AbstractLoadItem = tempLoader.add(itemConfig);
        this.loadItemsToIdMap.push(loadItem, itemConfig.id);

        this.addItemToLoadGroups(loadItem);
        // this.addItemListeners(loadItem);
        // this.updateLoadGroupStatusesForItem(loadItem);

        return loadItem;
    }

    public getLoadItem(id: string): AbstractLoadItem {
        return this.loadItemsToIdMap.getItem(id);
    }

    // protected addLoaderListeners(loader: Loader): void {
    //     /*this.eventListenerHelper.addEventListener(
    //         loader,
    //         LoadEvent.PROGRESS,
    //         () => {
    //             this.dispatchEvent(LoadManagerEvent.LOADER_PROGRESS, loader.id);
    //         }
    //     );
    //
    //     this.eventListenerHelper.addEventListener(
    //         loader,
    //         LoadEvent.COMPLETE,
    //         () => {
    //             this.dispatchEvent(LoadManagerEvent.LOADER_COMPLETE, loader.id);
    //         }
    //     );
    //
    //     /!*this.eventListenerHelper.addEventListener(
    //         loader,
    //         LoaderEvent.ITEM_COMPLETE,
    //         (item: AbstractLoadItem) => {
    //             this.dispatchEvent(LoadManagerEvent.LOADER_ITEM_COMPLETE, loader.id, item);
    //         }
    //     );*!/
    //
    //     this.eventListenerHelper.addEventListener(
    //         loader,
    //         LoadEvent.ERROR,
    //         (item: AbstractLoadItem) => {
    //             this.dispatchEvent(LoadManagerEvent.LOADER_ERROR, loader.id);
    //         }
    //     );*/
    // }

    // protected addItemListeners(item: AbstractLoadItem): void {
    //     /*this.eventListenerHelper.addEventListener(
    //         item,
    //         LoadStatusEvent.STATUS_CHANGE,
    //         () => {
    //             this.updateLoadGroupStatusesForItem(item);
    //         }
    //     );*/
    // }

    // Groups
    /*public getGroupStatus(group?: string): LoadStatus {
        let tempLoader: Loader = this.getLoader(group);
        return tempLoader.status;
    }*/

    public getGroup(groupName: string): LoadGroup {
        let result: LoadGroup = this.loadGroupsToNameMap.getItem(groupName);

        if (!result) {
            result = new LoadGroup(groupName);
            this.loadGroupsToNameMap.push(result, groupName);
        }

        return result;
    }

    protected addItemToLoadGroups(item: AbstractLoadItem): void {
        for (let groupName of item.config.loadGroups) {
            const tempGroup: LoadGroup = this.getGroup(groupName);
            tempGroup.addItem(item);
        }
    }

    /*protected updateLoadGroupStatusesForItem(item: AbstractLoadItem): void {
        for (let groupName of item.config.loadGroups) {
            const tempGroup: LoadGroup = this.getGroup(groupName);
            tempGroup.updateLoadStatus();
        }
    }

    protected triggerProgressEventForGroups(): void {
        for (let groupName of item.config.loadGroups) {
            const tempGroup: LoadGroup = this.getGroup(groupName);
            tempGroup.updateLoadStatus();
        }
    }*/

    public getLoadStatusForGroups(groupNames: string): LoadStatus {
        const statuses: LoadStatus[] = [];
        for (let name of groupNames) {
            const loadGroup: LoadGroup = this.getGroup(name);
            statuses.push(
                loadGroup.status
            );
        }

        const result: LoadStatus = LoadStatusPriorityTools.getTopPriorityStatus(statuses);
        return result;
    }

    public substituteUrlPlaceholders(sourceUrl: string): string {
        return StringTools.substitute(
            sourceUrl,
            this.substituteUrlParams
        );
    }

    public addSubstituteParams(params: object): void {
        ObjectTools.copyProps(
            this.substituteUrlParams,
            params
        );
    }
}