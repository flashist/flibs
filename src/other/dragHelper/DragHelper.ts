import { BaseObject, EventListenerHelper, NumberTools } from "@flashist/fcore";

import {
    Container,
    InputManager,
    InteractiveEvent, Point
} from "../../index";

import { FederatedPointerEvent } from "pixi.js";
import { DragHelperEvent } from "./DragHelperEvent";

export class DragHelper extends BaseObject {

    protected _view: Container;
    protected _hitArea: Container;

    protected hitAreaEventListenerHelper: EventListenerHelper<string>;

    protected _isDragActive: boolean;

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

    public minDistanceToStartDrag: number = 0;
    // protected lastPointerDownEvent: FederatedPointerEvent;
    protected firstDownGlobalX: number;
    protected firstDownGlobalY: number;

    public isDragCancelOnMultitouch: boolean = true;

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

    protected onPointerDown(event: FederatedPointerEvent): void {
        if (this.activePointerId) {
            if (this.isDragCancelOnMultitouch) {
                if (InputManager.instance.getActivePointers().length > 1) {
                    this.dragReset();
                }
            }

        } else {
            // this.lastPointerDownEvent = event;
            this.firstDownGlobalX = event.globalX;
            this.firstDownGlobalY = event.globalY;

            this.setActivePointerId(event.pointerId);

            if (this.minDistanceToStartDrag <= 0) {
                this.startDrag(event.globalX, event.globalY);
            }
        }
    }

    protected onPointerMove(event: FederatedPointerEvent): void {
        if (!this.activePointerId) {
            return;
        }

        if (event.pointerId === this.activePointerId) {
            let shouldStartDrag: boolean = false;
            let shouldUpdateDrag: boolean = false;
            if (this.isDragActive) {
                shouldUpdateDrag = true;
            } else {
                const tempDistance: number = NumberTools.getDistance(
                    event.globalX,
                    event.globalY,
                    this.firstDownGlobalX,
                    this.firstDownGlobalY
                );
                if (tempDistance > this.minDistanceToStartDrag) {
                    shouldStartDrag = true;
                    shouldUpdateDrag = true;
                }
            }

            if (shouldStartDrag) {
                this.startDrag(
                    this.firstDownGlobalX,
                    this.firstDownGlobalY
                );
            }
            if (shouldUpdateDrag) {
                this.updateDrag(event.pointerId, event.globalX, event.globalY);
            }

        } else {
            // If there are more than 1 pointer ID (or something is wrong with the original poitner id),
            // the stop the drag logic (stop drag completely, only 1-pointer-drags are allowed)
            this.dragReset();
        }
    }

    protected onPointerUp(event: FederatedPointerEvent): void {
        if (this.isDragActive) {
            this.updateDrag(event.pointerId, event.globalX, event.globalY);
        }
        this.dragReset();
    }

    protected dragReset(): void {
        this.stopDrag();
        this.resetActivePointerId();
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

    protected startDrag(globalX: number, globalY: number): void {
        if (this.isDragActive) {
            return;
        }
        this.isDragActive = true;

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

    protected setActivePointerId(pointerId: number): void {
        this.activePointerId = pointerId;
    }

    protected resetActivePointerId(): void {
        this.activePointerId = null;
    }

    public stopDrag(): void {
        if (!this.isDragActive) {
            return;
        }
        this.isDragActive = false;

        this.dispatchDragEndEvent();
    }

    protected updateDrag(pointerId: number, globalX: number, globalY: number): void {
        if (!this._isDragActive) {
            return;
        }
        if (this.activePointerId !== pointerId) {
            return;
        }

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

    public get isDragActive(): boolean {
        return this._isDragActive;
    }

    public set isDragActive(value: boolean) {
        if (value == this.isDragActive) {
            return;
        }

        this._isDragActive = value;
        if (this.isDragActive) {
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