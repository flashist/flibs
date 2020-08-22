import { AssociativeArray, BaseObject } from "@flashist/fcore";
import { AbstractLoadItem, LoadStatus } from "../../..";
export declare class LoadGroup extends BaseObject {
    protected name: string;
    protected items: AssociativeArray<AbstractLoadItem>;
    protected _status: LoadStatus;
    protected _progress: number;
    constructor(name: string);
    addItem(item: AbstractLoadItem): void;
    getAllItems(): AbstractLoadItem[];
    protected getTopPriorityLoadStatus(): LoadStatus;
    protected updateItemsData(): void;
    protected updateLoadStatus(): void;
    protected updateLoadProgress(): void;
    get status(): LoadStatus;
    get progress(): number;
    protected addItemListeners(item: AbstractLoadItem): void;
}
