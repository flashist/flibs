import { AssociativeArray, BaseObject } from "fcore";
import { ILoadItemConfig } from "./item/ILoadItemConfig";
import { Loader } from "./Loader";
import { AbstractLoadItem } from "./item/AbstractLoadItem";
import { LoadGroup } from "./group/LoadGroup";
import { LoadStatus } from "./loadstatus/LoadStatus";
export declare abstract class AbstractLoadManager extends BaseObject {
    protected loadersToIdMap: AssociativeArray<Loader>;
    protected loadGroupsToNameMap: AssociativeArray<LoadGroup>;
    protected construction(...args: any[]): void;
    addLoader(loader: Loader): void;
    protected getLoader(loaderId?: string): Loader;
    protected get defaultLoader(): Loader;
    getAllLoaders(): Loader[];
    add(item: ILoadItemConfig): AbstractLoadItem;
    protected addLoaderListeners(loader: Loader): void;
    protected addItemListeners(item: AbstractLoadItem): void;
    getGroup(groupName: string): LoadGroup;
    protected addItemToLoadGroups(item: AbstractLoadItem): void;
    getLoadStatusForGroups(groupNames: string): LoadStatus;
}
