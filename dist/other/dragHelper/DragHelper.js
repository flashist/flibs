var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { BaseObject, EventListenerHelper } from "@flashist/fcore";
import { FApp, InteractiveEvent } from "../../index";
import { DragHelperEvent } from "./DragHelperEvent";
var DragHelper = /** @class */ (function (_super) {
    __extends(DragHelper, _super);
    function DragHelper() {
        var _this = _super.call(this) || this;
        _this.startDragGlobalX = 0;
        _this.startDragGlobalY = 0;
        _this.lastDragGlobalX = 0;
        _this.lastDragGlobalY = 0;
        _this.changeDragGlobalX = 0;
        _this.changeDragGlobalY = 0;
        // Might be useful to prevent too quick/too small drags
        _this.dragUpdateDelay = 0;
        _this.dragStartTime = 0;
        return _this;
    }
    DragHelper.prototype.construction = function () {
        _super.prototype.construction.call(this);
        this.viewEventListenerHelper = new EventListenerHelper(this);
    };
    DragHelper.prototype.destruction = function () {
        _super.prototype.destruction.call(this);
        if (this.viewEventListenerHelper) {
            this.viewEventListenerHelper.destruction();
            this.viewEventListenerHelper = null;
        }
    };
    DragHelper.prototype.removeListeners = function () {
        _super.prototype.removeListeners.call(this);
        this.removeViewListeners(this.view);
    };
    DragHelper.prototype.addViewObjectListeners = function (object) {
        if (!object) {
            return;
        }
        this.viewEventListenerHelper.addEventListener(object, InteractiveEvent.DOWN, this.onMouseDown);
        this.viewEventListenerHelper.addEventListener(object, InteractiveEvent.UP, this.onMouseUp);
        this.viewEventListenerHelper.addEventListener(object, InteractiveEvent.UP_OUTSIDE, this.onMouseUp);
        /*this.viewEventListenerHelper.addEventListener(
            EngineAdapter.instance.mainTicker,
            TickerEvent.TICK,
            this.onTick
        );*/
        FApp.instance.ticker.add(this.onTick, this);
    };
    DragHelper.prototype.removeViewListeners = function (object) {
        if (!object) {
            return;
        }
        this.viewEventListenerHelper.removeAllListeners();
        FApp.instance.ticker.remove(this.onTick, this);
    };
    DragHelper.prototype.onMouseDown = function () {
        this.startDrag();
    };
    DragHelper.prototype.onMouseUp = function () {
        this.stopDrag();
    };
    DragHelper.prototype.onTick = function () {
        if (this.isDragStarted) {
            if (this.checkIsNeedUpdateDrag()) {
                this.updateDrag();
            }
        }
    };
    DragHelper.prototype.dispatchDragStartEvent = function () {
        this.dispatchEvent(DragHelperEvent.DRAG_START);
    };
    DragHelper.prototype.dispatchDragUpdateEvent = function () {
        this.dispatchEvent(DragHelperEvent.DRAG_UPDATE);
    };
    DragHelper.prototype.dispatchDragEndEvent = function () {
        this.dispatchEvent(DragHelperEvent.DRAG_END);
    };
    DragHelper.prototype.startDrag = function () {
        if (this.isDragStarted) {
            return;
        }
        this.isDragStarted = true;
        var globalPos = FApp.instance.getGlobalInteractionPosition();
        this.startDragGlobalX = globalPos.x;
        this.startDragGlobalY = globalPos.y;
        this.lastDragGlobalX = this.startDragGlobalX;
        this.lastDragGlobalY = this.startDragGlobalY;
        this.changeDragGlobalX = 0;
        this.changeDragGlobalY = 0;
        this.dispatchDragStartEvent();
    };
    DragHelper.prototype.stopDrag = function () {
        if (!this.isDragStarted) {
            return;
        }
        this.isDragStarted = false;
        this.updateDrag();
        this.dispatchDragEndEvent();
    };
    DragHelper.prototype.updateDrag = function () {
        // Если последняя точка перетаскивания не изменилась, то прерываем функцию
        var globalPos = FApp.instance.getGlobalInteractionPosition();
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
        this.dispatchDragUpdateEvent();
    };
    Object.defineProperty(DragHelper.prototype, "isDragStarted", {
        get: function () {
            return this._isDragStarted;
        },
        set: function (value) {
            if (value == this.isDragStarted) {
                return;
            }
            this._isDragStarted = value;
            if (this.isDragStarted) {
                this.dragStartTime = Date.now();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DragHelper.prototype, "view", {
        get: function () {
            return this._view;
        },
        set: function (value) {
            if (value == this.view) {
                return;
            }
            this.removeViewListeners(this.view);
            this._view = value;
            this.addViewObjectListeners(this.view);
        },
        enumerable: false,
        configurable: true
    });
    DragHelper.prototype.checkIsNeedUpdateDrag = function () {
        var result;
        if (Date.now() >= this.dragStartTime + this.dragUpdateDelay) {
            result = true;
        }
        return result;
    };
    return DragHelper;
}(BaseObject));
export { DragHelper };
//# sourceMappingURL=DragHelper.js.map