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
import { BaseObject, EventListenerHelper } from "fcore";
import { LoaderQueue } from "./LoaderQueue";
import { AbstractLoadFactory } from "./AbstractLoadFactory";
import { LoadStatus } from "./loadstatus/LoadStatus";
import { LoadStatusEvent } from "./loadstatus/LoadStatusEvent";
import { LoadEvent } from "./LoadEvent";
import { LoadGroup } from "./group/LoadGroup";
var Loader = /** @class */ (function (_super) {
    __extends(Loader, _super);
    function Loader(id) {
        var _this = _super.call(this, id) || this;
        _this.stopOnError = false;
        _this.autoStartOnAdd = true;
        return _this;
    }
    Loader.prototype.construction = function (id) {
        _super.prototype.construction.call(this);
        this.id = id;
        this.group = new LoadGroup(this.id);
        this.queue = new LoaderQueue();
        this.curItemEventListenerHelper = new EventListenerHelper(this);
    };
    Loader.prototype.destruction = function () {
        _super.prototype.destruction.call(this);
        if (this.curItemEventListenerHelper) {
            this.curItemEventListenerHelper.destruction();
            this.curItemEventListenerHelper = null;
        }
    };
    Loader.prototype.addListeners = function () {
        _super.prototype.addListeners.call(this);
        this.eventListenerHelper.addEventListener(this.group, LoadStatusEvent.STATUS_CHANGE, this.onGroupStatusChange);
        this.eventListenerHelper.addEventListener(this.group, LoadEvent.PROGRESS, this.onGroupStatusChange);
    };
    Loader.prototype.onGroupStatusChange = function () {
        this.dispatchEvent(LoadStatusEvent.STATUS_CHANGE);
    };
    Loader.prototype.onGroupProgress = function () {
        this.dispatchEvent(LoadEvent.PROGRESS);
    };
    Loader.prototype.start = function () {
        /*if (this.curItem) {
            this.load(this.curItem)
        } else {
            this.loadNext();
        }*/
        this.loadNext();
    };
    Loader.prototype.stop = function () {
        if (this.curItem) {
            this.curItem.stop();
        }
    };
    Loader.prototype.add = function (config) {
        var result = this.queue.get(config);
        if (!result) {
            result = AbstractLoadFactory.instance.createItem(config);
            this.queue.add(result);
        }
        if (this.status !== LoadStatus.LOADING) {
            if (this.autoStartOnAdd) {
                this.start();
            }
        }
        return result;
    };
    Loader.prototype.loadNext = function () {
        var tempItem = this.queue.getNextToLoad();
        if (tempItem) {
            this.load(tempItem);
        }
        else {
            this.curItem = null;
        }
    };
    Loader.prototype.load = function (item) {
        this.curItem = item;
        this.addCurItemListeners();
        this.curItem.start();
    };
    Loader.prototype.addCurItemListeners = function () {
        this.removeCurItemListeners();
        if (!this.curItem) {
            return;
        }
        /*this.curItemEventListenerHelper.addEventListener(
            this.curItem,
            LoadEvent.PROGRESS,
            this.onItemProgress
        );*/
        this.curItemEventListenerHelper.addEventListener(this.curItem, LoadEvent.COMPLETE, this.onItemComplete);
        this.curItemEventListenerHelper.addEventListener(this.curItem, LoadEvent.ERROR, this.onItemError);
    };
    Loader.prototype.removeCurItemListeners = function () {
        if (!this.curItem) {
            return;
        }
        this.curItemEventListenerHelper.removeAllListeners(this.curItem);
    };
    Loader.prototype.onItemComplete = function () {
        this.queue.onItemLoad(this.curItem);
        this.loadNext();
    };
    Loader.prototype.onItemError = function () {
        this.queue.onItemLoad(this.curItem);
        if (this.stopOnError) {
            this.stop();
        }
        else {
            this.loadNext();
        }
    };
    Loader.prototype.getCurrentLoadingItem = function () {
        return this.curItem;
    };
    Object.defineProperty(Loader.prototype, "status", {
        get: function () {
            return this.group.status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Loader.prototype, "progress", {
        get: function () {
            return this.group.progress;
        },
        enumerable: false,
        configurable: true
    });
    return Loader;
}(BaseObject));
export { Loader };
//# sourceMappingURL=Loader.js.map