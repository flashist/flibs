import { BaseObject, EventListenerHelper } from "@flashist/fcore";

import {
    Container, FApp, InteractiveEvent, Point
} from "../../index";

import { DragHelperEvent } from "./DragHelperEvent";

export class DragHelper extends BaseObject {

    protected _view: Container;
    protected _hitArea: Container;

    protected hitAreaEventListenerHelper: EventListenerHelper<string>;

    protected _isDragStarted: boolean;

    protected activePointerId: number;

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

        let tempHitAreaDispatcher: Container = this.view;
        if (this.hitArea) {
            tempHitAreaDispatcher = this.hitArea;
        }
        this.addHitAreaListeners(tempHitAreaDispatcher);
    }

    protected addHitAreaListeners(dispatcher: Container): void {
        if (!dispatcher) {
            return;
        }

        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.DOWN,
            this.onPointerDown
        );
        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.MOVE,
            this.onPointerMove
        );
        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.UP,
            this.onPointerUp
        );
        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.UP_OUTSIDE,
            this.onPointerUp
        );
        this.hitAreaEventListenerHelper.addEventListener(
            dispatcher,
            InteractiveEvent.CANCEL,
            this.onPointerUp
        );

        /*this.viewEventListenerHelper.addEventListener(
            EngineAdapter.instance.mainTicker,
            TickerEvent.TICK,
            this.onTick
        );*/
        // FApp.instance.ticker.add(this.onTick, this);
    }

    protected removeHitAreaListeners(): void {
        this.hitAreaEventListenerHelper.removeAllListeners();

        // FApp.instance.ticker.remove(this.onTick, this);
    }


    protected onPointerDown(event: PointerEvent): void {
        this.startDrag(event.pointerId, event.clientX, event.clientY);
    }

    protected onPointerMove(event: PointerEvent): void {
        if (event.pointerId !== this.activePointerId) {
            return;
        }

        this.updateDrag(event.pointerId, event.clientX, event.clientY);
    }

    protected onPointerUp(event: PointerEvent): void {
        this.updateDrag(event.pointerId, event.clientX, event.clientY);

        this.stopDrag();
    }

    // protected onTick(): void {
    //     if (this.isDragStarted) {
    //         if (this.checkIsNeedUpdateDrag()) {
    //             this.updateDrag();
    //         }
    //     }
    // }


    protected dispatchDragStartEvent(): void {
        this.dispatchEvent(DragHelperEvent.DRAG_START);
    }

    protected dispatchDragUpdateEvent(): void {
        this.dispatchEvent(DragHelperEvent.DRAG_UPDATE);
    }

    protected dispatchDragEndEvent(): void {
        this.dispatchEvent(DragHelperEvent.DRAG_END);
    }

    protected startDrag(pointerId: number, globalX: number, globalY: number): void {
        if (this.isDragStarted) {
            return;
        }
        this.isDragStarted = true;

        this.activePointerId = pointerId;

        // const globalPos: Point = FApp.instance.getGlobalInteractionPosition();
        this.startDragGlobalX = globalX;
        this.startDragGlobalY = globalY;
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

        this.activePointerId = null;

        this.dispatchDragEndEvent();
    }

    protected updateDrag(pointerId: number, globalX: number, globalY: number): void {
        // Если последняя точка перетаскивания не изменилась, то прерываем функцию
        // const globalPos: Point = FApp.instance.getGlobalInteractionPosition();
        if (this.lastDragGlobalX == globalX &&
            this.lastDragGlobalY == globalY) {
            return;
        }

        this.lastDragGlobalX = globalX;
        this.lastDragGlobalY = globalY;

        this.changeDragGlobalX = this.lastDragGlobalX - this.startDragGlobalX;
        this.changeDragGlobalY = this.lastDragGlobalY - this.startDragGlobalY;
        console.log("this.lastDragGlobalX:", this.lastDragGlobalX, " | this.lastDragGlobalY:", this.lastDragGlobalY);
        console.log("this.startDragGlobalX:", this.startDragGlobalX, " | this.startDragGlobalY:", this.startDragGlobalY);

        this.view.parent.toLocal({ x: this.lastDragGlobalX, y: this.lastDragGlobalY }, null, this.lastDragLocalPoint);
        console.log("this.lastDragLocalPoint: ", this.lastDragLocalPoint);

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


    get view(): Container {
        return this._view;
    }
    set view(value: Container) {

        if (value == this.view) {
            return;
        }

        this._view = value;
        this.updateHitAreaListeners();
    }


    get hitArea(): Container {
        return this._hitArea;
    }
    set hitArea(value: Container) {

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