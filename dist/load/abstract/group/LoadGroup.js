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
import { AssociativeArray, BaseObject } from "@flashist/fcore";
import { LoadEvent, LoadProgressTool, LoadStatus } from "../../..";
import { LoadStatusPriorityTools } from "../loadstatus/LoadStatusPriorityTools";
import { LoadStatusEvent } from "../loadstatus/LoadStatusEvent";
var LoadGroup = /** @class */ (function (_super) {
    __extends(LoadGroup, _super);
    function LoadGroup(name) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.items = new AssociativeArray();
        _this._status = LoadStatus.WAIT;
        _this._progress = 0;
        return _this;
    }
    LoadGroup.prototype.addItem = function (item) {
        this.items.push(item, item.config.id);
        this.addItemListeners(item);
        this.updateItemsData();
    };
    LoadGroup.prototype.getAllItems = function () {
        return this.items.getAllItems();
    };
    LoadGroup.prototype.getTopPriorityLoadStatus = function () {
        var statuses = [];
        var allItems = this.items.getAllItems();
        for (var _i = 0, allItems_1 = allItems; _i < allItems_1.length; _i++) {
            var singleItem = allItems_1[_i];
            statuses.push(singleItem.status);
        }
        var result = LoadStatusPriorityTools.getTopPriorityStatus(statuses);
        return result;
    };
    LoadGroup.prototype.updateItemsData = function () {
        this.updateLoadStatus();
        this.updateLoadProgress();
    };
    LoadGroup.prototype.updateLoadStatus = function () {
        var newStatus = this.getTopPriorityLoadStatus();
        if (newStatus === this.status) {
            return;
        }
        this._status = newStatus;
        this.dispatchEvent(LoadStatusEvent.STATUS_CHANGE);
        if (this.status === LoadStatus.ERROR) {
            this.dispatchEvent(LoadEvent.ERROR);
        }
        else if (this.status === LoadStatus.COMPLETE) {
            this.dispatchEvent(LoadEvent.COMPLETE);
        }
        else if (this.status === LoadStatus.LOADING) {
            this.dispatchEvent(LoadEvent.START);
        }
    };
    LoadGroup.prototype.updateLoadProgress = function () {
        var newProgressData = LoadProgressTool.getProgressForItems(this.items.getAllItems());
        if (newProgressData.progress === this._progress) {
            return;
        }
        this._progress = newProgressData.progress;
        this.dispatchEvent(LoadEvent.PROGRESS);
    };
    Object.defineProperty(LoadGroup.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(LoadGroup.prototype, "progress", {
        get: function () {
            return this._progress;
        },
        enumerable: false,
        configurable: true
    });
    LoadGroup.prototype.addItemListeners = function (item) {
        var _this = this;
        this.eventListenerHelper.addEventListener(item, LoadStatusEvent.STATUS_CHANGE, function () {
            _this.updateItemsData();
        });
        this.eventListenerHelper.addEventListener(item, LoadEvent.PROGRESS, function () {
            _this.updateLoadProgress();
        });
    };
    return LoadGroup;
}(BaseObject));
export { LoadGroup };
//# sourceMappingURL=LoadGroup.js.map