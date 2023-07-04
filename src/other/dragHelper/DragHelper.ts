import { BaseObject, EventListenerHelper } from "@flashist/fcore";

import {
    DisplayObject, FApp, InteractiveEvent, Point
} from "../../index";

import { DragHelperEvent } from "./DragHelperEvent";

export class DragHelper extends BaseObject {

    protected _view: DisplayObject;
    protected _hitArea: DisplayObject;

    protected hitAreaEventListenerHelper: EventListenerHelper<string>;

    protected _isDragStarted: boolean;

    public startDragGlobalX: number = 0;
    public startDragGlobalY: number = 0;
    public lastDragGlobalX: number = 0;
    public lastDragGlobalY: number = 0;
    public changeDragGlobalX: number = 0;
    public changeDragGlobalY: number = 0;

    protected startDragLocalPoint: Point = new Point();
    protected lastDragLocalPoint: Point = new Point();
    // Shift is needed to calculate correct final position of the drag
    protected startDragViewShiftPoint: Point = new Point();

    // Might be useful to prevent too quick/too small drags
    public dragUpdateDelay: number = 0;

    protected dragStartTime: number = 0;

    public constructor() {
        super();
    }


    protected construction(): void {
        super.construction();

        this.hitAreaEventListenerHelper = new EventListenerHelper(this);
    }

    destruction(): void {
        super.destruction();

        if (this.hitAreaEventListenerHelper) {
            this.hitAreaEventListenerHelper.destruction();
            this.hitAreaEventListenerHelper = null;
        }
    }


    protected removeListeners(): void {
        super.removeListeners();

        this.removeHitAreaListeners();
    }


    protected updateHitAreaListeners(): void {
        this.removeHitAreaListeners();

        let tempHitAreaDispatcher: DisplayObject = this.view;
        if (this.hitArea) {
            tempHitAreaDispatcher = this.hitArea;
        }
        this.addHitAreaListeners(tempHitAreaDispatcher);
    }

    protected addHitAreaListeners(dispatcher: DisplayObject): void {
        if (!dispatcher) {
            return;
        }

        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.DOWN,
            this.onMouseDown
        );
        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.UP,
            this.onMouseUp
        );
        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.UP_OUTSIDE,
            this.onMouseUp
        );

        /*this.viewEventListenerHelper.addEventListener(
            EngineAdapter.instance.mainTicker,
            TickerEvent.TICK,
            this.onTick
        );*/
        FApp.instance.ticker.add(this.onTick, this);
    }

    protected removeHitAreaListeners(): void {
        this.hitAreaEventListenerHelper.removeAllListeners();

        FApp.instance.ticker.remove(this.onTick, this);
    }


    protected onMouseDown(): void {
        this.startDrag();
    }

    protected onMouseUp(): void {
        this.stopDrag();
    }

    protected onTick(): void {
        if (this.isDragStarted) {
            if (this.checkIsNeedUpdateDrag()) {
                this.updateDrag();
            }
        }
    }


    protected dispatchDragStartEvent(): void {
        this.dispatchEvent(DragHelperEvent.DRAG_START);
    }

    protected dispatchDragUpdateEvent(): void {
        this.dispatchEvent(DragHelperEvent.DRAG_UPDATE);
    }

    protected dispatchDragEndEvent(): void {
        this.dispatchEvent(DragHelperEvent.DRAG_END);
    }

    protected startDrag(): void {
        if (this.isDragStarted) {
            return;
        }
        this.isDragStarted = true;

        const globalPos: Point = FApp.instance.getGlobalInteractionPosition();
        this.startDragGlobalX = globalPos.x;
        this.startDragGlobalY = globalPos.y;
        this.view.parent.toLocal({ x: this.startDragGlobalX, y: this.startDragGlobalY }, null, this.startDragLocalPoint);

        // 
        this.startDragViewShiftPoint.x = this.startDragLocalPoint.x - this.view.x;
        this.startDragViewShiftPoint.y = this.startDragLocalPoint.y - this.view.y;

        this.lastDragGlobalX = this.startDragGlobalX;
        this.lastDragGlobalY = this.startDragGlobalY;
        this.lastDragLocalPoint.x = this.startDragLocalPoint.x;
        this.lastDragLocalPoint.y = this.startDragLocalPoint.y;

        this.changeDragGlobalX = 0;
        this.changeDragGlobalY = 0;

        this.dispatchDragStartEvent();
    }

    public stopDrag(): void {
        if (!this.isDragStarted) {
            return;
        }
        this.isDragStarted = false;

        this.updateDrag();

        this.dispatchDragEndEvent();
    }

    protected updateDrag(): void {
        // Если последняя точка перетаскивания не изменилась, то прерываем функцию
        const globalPos: Point = FApp.instance.getGlobalInteractionPosition();
        if (this.lastDragGlobalX == globalPos.x &&
            this.lastDragGlobalY == globalPos.y) {
            return;
        }

        this.lastDragGlobalX = globalPos.x;
        this.lastDragGlobalY = globalPos.y;

        this.changeDragGlobalX = this.lastDragGlobalX - this.startDragGlobalX;
        this.changeDragGlobalY = this.lastDragGlobalY - this.startDragGlobalY;
        console.log("this.lastDragGlobalX:", this.lastDragGlobalX, " | this.lastDragGlobalY:", this.lastDragGlobalY);
        console.log("this.startDragGlobalX:", this.startDragGlobalX, " | this.startDragGlobalY:", this.startDragGlobalY);

        this.view.parent.toLocal({ x: this.lastDragGlobalX, y: this.lastDragGlobalY }, null, this.lastDragLocalPoint);

        this.dispatchDragUpdateEvent();
    }

    public get isDragStarted(): boolean {
        return this._isDragStarted;
    }

    public set isDragStarted(value: boolean) {
        if (value == this.isDragStarted) {
            return;
        }

        this._isDragStarted = value;
        if (this.isDragStarted) {
            this.dragStartTime = Date.now();
        }
    }


    get view(): DisplayObject {
        return this._view;
    }
    set view(value: DisplayObject) {

        if (value == this.view) {
            return;
        }

        this._view = value;
        this.updateHitAreaListeners();
    }


    get hitArea(): DisplayObject {
        return this._hitArea;
    }
    set hitArea(value: DisplayObject) {

        if (value == this.hitArea) {
            return;
        }

        this._hitArea = value;
        this.updateHitAreaListeners();
    }


    protected checkIsNeedUpdateDrag(): boolean {
        var result: boolean;

        if (Date.now() >= this.dragStartTime + this.dragUpdateDelay) {
            result = true;
        }

        return result;
    }

    public get startDragLocalX(): number {
        return this.startDragLocalPoint.x;
    }
    public get startDragLocalY(): number {
        return this.startDragLocalPoint.y;
    }

    public get lastDragLocalX(): number {
        return this.lastDragLocalPoint.x;
    }
    public get lastDragLocalY(): number {
        return this.lastDragLocalPoint.y;
    }

    public get changeDragLocalX(): number {
        return this.lastDragLocalPoint.x - this.startDragLocalPoint.x;
    }
    public get changeDragLocalY(): number {
        return this.lastDragLocalPoint.y - this.startDragLocalPoint.y;
    }

    public get lastDragWithShiftLocalX(): number {
        return this.lastDragLocalPoint.x - this.startDragViewShiftPoint.x;
    }
    public get lastDragWithShiftLocalY(): number {
        return this.lastDragLocalPoint.y - this.startDragViewShiftPoint.y;
    }
}