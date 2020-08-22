import {AssociativeArray, BaseObject} from "fcore";
import {AbstractLoadItem, ILoadProgressVO, LoadEvent, LoadProgressTool, LoadStatus} from "../../..";
import {LoadStatusPriorityTools} from "../loadstatus/LoadStatusPriorityTools";
import {LoadStatusEvent} from "../loadstatus/LoadStatusEvent";

export class LoadGroup extends BaseObject {

    protected items: AssociativeArray<AbstractLoadItem> = new AssociativeArray<AbstractLoadItem>();

    protected _status: LoadStatus = LoadStatus.WAIT;
    protected _progress: number = 0;

    constructor(protected name: string) {
        super();
    }

    public addItem(item: AbstractLoadItem): void {
        this.items.push(item, item.config.id);

        this.addItemListeners(item);

        this.updateItemsData();
    }

    public getAllItems(): AbstractLoadItem[] {
        return this.items.getAllItems();
    }

    protected getTopPriorityLoadStatus(): LoadStatus {
        const statuses: LoadStatus[] = [];
        const allItems = this.items.getAllItems();
        for (let singleItem of allItems) {
            statuses.push(singleItem.status);
        }

        const result: LoadStatus = LoadStatusPriorityTools.getTopPriorityStatus(statuses);
        return result;
    }

    protected updateItemsData(): void {
        this.updateLoadStatus();
        this.updateLoadProgress();
    }

    protected updateLoadStatus(): void {
        const newStatus: LoadStatus = this.getTopPriorityLoadStatus();
        if (newStatus === this.status) {
            return;
        }

        this._status = newStatus;

        this.dispatchEvent(LoadStatusEvent.STATUS_CHANGE);
        if (this.status === LoadStatus.ERROR) {
            this.dispatchEvent(LoadEvent.ERROR);
        } else if (this.status === LoadStatus.COMPLETE) {
            this.dispatchEvent(LoadEvent.COMPLETE);
        } else if (this.status === LoadStatus.LOADING) {
            this.dispatchEvent(LoadEvent.START);
        }
    }

    protected updateLoadProgress(): void {
        const newProgressData: ILoadProgressVO = LoadProgressTool.getProgressForItems(this.items.getAllItems());
        if (newProgressData.progress === this._progress) {
            return;
        }

        this._progress = newProgressData.progress;
        this.dispatchEvent(LoadEvent.PROGRESS);
    }

    public get status(): LoadStatus {
        return this._status;
    }

    public get progress(): number {
        return this._progress;
    }

    protected addItemListeners(item: AbstractLoadItem): void {
        this.eventListenerHelper.addEventListener(
            item,
            LoadStatusEvent.STATUS_CHANGE,
            () => {
                this.updateItemsData();
            }
        );

        this.eventListenerHelper.addEventListener(
            item,
            LoadEvent.PROGRESS,
            () => {
                this.updateLoadProgress()
            }
        );
    }
}