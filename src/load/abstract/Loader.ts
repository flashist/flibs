import { BaseObject, EventListenerHelper } from "@flashist/fcore";

import { AbstractLoadItem } from "./item/AbstractLoadItem";
import { ILoadItemConfig } from "./item/ILoadItemConfig";
import { LoaderQueue } from "./LoaderQueue";
import { AbstractLoadFactory } from "./AbstractLoadFactory";
import { LoadStatus } from "./loadstatus/LoadStatus";
import { LoadStatusEvent } from "./loadstatus/LoadStatusEvent";
import { LoadEvent } from "./LoadEvent";
import { LoadGroup } from "./group/LoadGroup";

export class Loader extends BaseObject {

    public id: string;

    protected queue: LoaderQueue;
    protected group: LoadGroup;

    public stopOnError: boolean = false;

    protected curItem: AbstractLoadItem;
    protected curItemEventListenerHelper: EventListenerHelper<string>;

    public autoStartOnAdd: boolean = true;

    constructor(id: string) {
        super(id);
    }

    construction(id: string): void {
        super.construction();

        this.id = id;
        this.group = new LoadGroup(this.id);
        this.queue = new LoaderQueue();

        this.curItemEventListenerHelper = new EventListenerHelper<string>(this);
    }

    destruction(): void {
        super.destruction();

        if (this.curItemEventListenerHelper) {
            this.curItemEventListenerHelper.destruction();
            this.curItemEventListenerHelper = null;
        }
    }

    protected addListeners(): void {
        super.addListeners();

        this.eventListenerHelper.addEventListener(
            this.group,
            LoadStatusEvent.STATUS_CHANGE,
            this.onGroupStatusChange
        );

        this.eventListenerHelper.addEventListener(
            this.group,
            LoadEvent.PROGRESS,
            this.onGroupStatusChange
        );
    }

    protected onGroupStatusChange(): void {
        this.dispatchEvent(LoadStatusEvent.STATUS_CHANGE);
    }

    protected onGroupProgress(): void {
        this.dispatchEvent(LoadEvent.PROGRESS);
    }

    public start(): void {
        /*if (this.curItem) {
            this.load(this.curItem)
        } else {
            this.loadNext();
        }*/
        this.loadNext();
    }

    public stop(): void {
        if (this.curItem) {
            this.curItem.stop();
        }
    }

    add(config: ILoadItemConfig): AbstractLoadItem {
        let result: AbstractLoadItem = this.queue.get(config);

        if (!result) {
            // Finding dependency loading
            const dependencyItems: AbstractLoadItem[] = [];
            if (config.dependencies) {
                for (let singleDependencyConfig of config.dependencies) {
                    const tempDependencyLoadItem: AbstractLoadItem = this.add(singleDependencyConfig);
                    dependencyItems.push(tempDependencyLoadItem);
                }
            }

            result = AbstractLoadFactory.instance.createItem(config);
            result.dependencies = dependencyItems;

            this.queue.add(result);
        }

        if (this.status !== LoadStatus.LOADING) {
            if (this.autoStartOnAdd) {
                this.start();
            }
        }

        return result;
    }

    protected loadNext(): void {
        let tempItem: AbstractLoadItem = this.queue.getNextToLoad();
        if (tempItem) {
            this.load(tempItem);

        } else {
            this.curItem = null;
        }
    }

    protected load(item: AbstractLoadItem): void {
        this.curItem = item;
        this.addCurItemListeners();

        this.curItem.start();
    }

    protected addCurItemListeners(): void {
        this.removeCurItemListeners();

        if (!this.curItem) {
            return;
        }

        /*this.curItemEventListenerHelper.addEventListener(
            this.curItem,
            LoadEvent.PROGRESS,
            this.onItemProgress
        );*/

        // this.curItemEventListenerHelper.addEventListener(
        //     this.curItem,
        //     LoadEvent.COMPLETE,
        //     this.onItemComplete
        // );
        // this.curItemEventListenerHelper.addEventListener(
        //     this.curItem,
        //     LoadEvent.ERROR,
        //     this.onItemError
        // );
        this.curItemEventListenerHelper.addEventListener(
            this.curItem,
            LoadStatusEvent.STATUS_CHANGE,
            () => {
                if (this.curItem.status === LoadStatus.COMPLETE) {
                    this.onItemComplete();
                } else if (this.curItem.status === LoadStatus.ERROR) {
                    this.onItemError();
                }
            }
        );

        // this.curItemEventListenerHelper.addEventListener(
        //     this.curItem,
        //     LoadEvent.ERROR,
        //     this.onItemError
        // );
    }

    protected removeCurItemListeners(): void {
        if (!this.curItem) {
            return;
        }

        this.curItemEventListenerHelper.removeAllListeners(this.curItem);
    }

    protected onItemComplete(): void {
        this.queue.onItemLoad(this.curItem);

        this.loadNext();
    }

    protected onItemError(): void {
        this.queue.onItemLoad(this.curItem);

        if (this.stopOnError) {
            this.stop();

        } else {
            this.loadNext();
        }
    }

    public getCurrentLoadingItem(): AbstractLoadItem {
        return this.curItem;
    }

    get status(): LoadStatus {
        return this.group.status;
    }

    get progress(): number {
        return this.group.progress;
    }
}