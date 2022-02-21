import {EventListenerHelper, Logger, IDatable} from "@flashist/fcore";

import {
    DisplayObjectContainer,
    FStage,
    FDisplayEvent,
    DisplayEvent,
    FDisplayTools,
    serviceLocatorProcessItemOnActivate,
    serviceLocatorProcessItemOnDeactivate,
    DisplayObject
} from "../../../../index";

export class FContainer<DataType extends any = any> extends DisplayObjectContainer implements IDatable {

    public isFContainer: boolean = true;

    protected isConstructed: boolean;
    public isNeedToDestructOnRemoveFromStage: boolean = false;

    private _data: DataType;
    private _stage: FStage;

    protected eventListenerHelper: EventListenerHelper<Event | string | any>;
    protected stageListenerHelper: EventListenerHelper<Event | string | any>;

    constructor(...args) {
        super();

        this.eventListenerHelper = new EventListenerHelper(this);
        this.stageListenerHelper = new EventListenerHelper(this);

        this.construction(...args);
        this.isConstructed = true;
        this.onConstructedComplete();

        // PIXI eveents
        this.stageListenerHelper.addEventListener(
            this,
            DisplayEvent.ADDED,
            () => {
                this.stage = FDisplayTools.findStageInDisplayList(this);
            }
        );
        this.stageListenerHelper.addEventListener(
            this,
            DisplayEvent.REMOVED,
            (container: DisplayObjectContainer) => {
                this.stage = null;
            }
        );
        // Custom events
        this.stageListenerHelper.addEventListener(
            this,
            FDisplayEvent.ADDED_TO_STAGE,
            this.onAddedToStage
        );
        this.stageListenerHelper.addEventListener(
            this,
            FDisplayEvent.REMOVED_FROM_STAGE,
            this.onRemovedFromStage
        );
    }


    protected construction(...args): void {
        // Note: subclasses should implement their own logic here
    }

    public destruction(): void {
        // Note: subclasses should implement their own logic here

        this.destroy({children: true});

        if (this.eventListenerHelper) {
            this.eventListenerHelper.destruction();
            this.eventListenerHelper = null;
        }

        if (this.stageListenerHelper) {
            this.stageListenerHelper.destruction();
            this.stageListenerHelper = null;
        }

        this.removeListeners();
    }


    protected addListeners(): void {
        this.removeListeners();

        // Note: subclasses should implement their own logic here
    }

    protected removeListeners(): void {
        if (this.eventListenerHelper) {
            this.eventListenerHelper.removeAllListeners();
        }
    }

    protected onConstructedComplete(): void {
        // this.commitData();
    }

    protected onAddedToStage(): void {
        serviceLocatorProcessItemOnActivate(this);

        this.addListeners();
        this.commitData();
        this.processDataSet(this.data);
    }

    protected onRemovedFromStage(): void {
        serviceLocatorProcessItemOnDeactivate(this);

        this.removeListeners();

        if (this.isNeedToDestructOnRemoveFromStage) {
            this.destruction();
        }
    }

    protected commitData(): void {
        // Note: subclasses should implement their own logic here

        this.arrange();
    }

    protected arrange(): void {
        // Note: subclasses should implement their own logic here
    }


    public addChildBefore(child: DisplayObject, beforeChild: DisplayObject): void {
        const beforeChildIndex: number = this.getChildIndex(beforeChild);
        if (beforeChildIndex === -1) {
            return;
        }

        let addIndex: number = beforeChildIndex - 1;
        if (addIndex < 0) {
            addIndex = 0;
        }

        this.addChildAt(child, addIndex);
    }

    public addChildAfter(child: DisplayObject, afterChild: DisplayObject): void {
        const afterChildIndex: number = this.getChildIndex(afterChild);
        if (afterChildIndex === -1) {
            return;
        }

        let addIndex: number = afterChildIndex + 1;
        if (addIndex > this.children.length) {
            addIndex = this.children.length;
        }

        this.addChildAt(child, addIndex);
    }


    public get data(): DataType {
        return this._data;
    }
    public set data(value: DataType) {
        if (this.data == value) {
            return;
        }

        this.processDataUnset(this._data);
        this._data = value;
        this.processDataSet(this._data);

        this.commitData();
    }

    protected processDataUnset(value: DataType): void {
        // Subclasses should implement their logic
    }

    protected processDataSet(value: DataType): void {
        // Subclasses should implement their logic
    }

    public get stage(): FStage {
        return this._stage;
    }
    public set stage(value: FStage) {

        if (value === this._stage) {
            return;
        }

        if (this._stage && value) {
            Logger.error("FContainer | set stage __ The stage param can't be set to different value, before being empty!");
            return;
        }

        this._stage = value;
        this.updateChildrenStage();

        if (this.stage) {
            this.emit(FDisplayEvent.ADDED_TO_STAGE);
        } else {
            this.emit(FDisplayEvent.REMOVED_FROM_STAGE);
        }
    }

    protected updateChildrenStage(): void {
        for (const child of this.children) {
            if (FContainer.isFContainer(child)) {
                (child as FContainer).stage = this.stage;
            }
        }
    }

    //
    static isFContainer(object: any): boolean {
        return (object as FContainer).isFContainer;
    }
}