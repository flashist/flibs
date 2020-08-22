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
import { LoadStatus } from "../loadstatus/LoadStatus";
import { LoadStatusEvent } from "../loadstatus/LoadStatusEvent";
import { LoadEvent } from "../LoadEvent";
var AbstractLoadItem = /** @class */ (function (_super) {
    __extends(AbstractLoadItem, _super);
    function AbstractLoadItem(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this._status = LoadStatus.WAIT;
        _this.internalPrepare();
        return _this;
    }
    AbstractLoadItem.prototype.internalPrepare = function () {
        this.eventListenerHelper = new EventListenerHelper(this);
    };
    AbstractLoadItem.prototype.start = function () {
        if (this.status === LoadStatus.LOADING) {
            return;
        }
        this.status = LoadStatus.LOADING;
        this.addLoadingListeners();
        this.internalStart();
    };
    AbstractLoadItem.prototype.internalStart = function () {
        // Override if needed
    };
    AbstractLoadItem.prototype.stop = function () {
        if (this.status === LoadStatus.WAIT) {
            return;
        }
        this.status = LoadStatus.WAIT;
        this.removeLoadingListeners();
        this.internalStop();
    };
    AbstractLoadItem.prototype.internalStop = function () {
        // Override if needed
    };
    AbstractLoadItem.prototype.addLoadingListeners = function () {
        // Override if needed
    };
    AbstractLoadItem.prototype.removeLoadingListeners = function () {
        this.eventListenerHelper.removeAllListeners();
    };
    AbstractLoadItem.prototype.processLoadingProgress = function (progress) {
        this.progress = progress;
        this.dispatchEvent(LoadEvent.PROGRESS);
    };
    AbstractLoadItem.prototype.processLoadingComplete = function (data) {
        this.data = data;
        this.status = LoadStatus.COMPLETE;
        this.removeLoadingListeners();
        this.dispatchEvent(LoadEvent.COMPLETE, data);
    };
    AbstractLoadItem.prototype.processLoadingError = function (errorData) {
        this.errorData = errorData;
        this.status = LoadStatus.ERROR;
        this.removeLoadingListeners();
        this.dispatchEvent(LoadEvent.ERROR);
    };
    AbstractLoadItem.prototype.getIsSuccess = function () {
        return !this.errorData;
    };
    Object.defineProperty(AbstractLoadItem.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (value) {
            if (value === this.status) {
                return;
            }
            this._status = value;
            this.dispatchEvent(LoadStatusEvent.STATUS_CHANGE);
        },
        enumerable: false,
        configurable: true
    });
    return AbstractLoadItem;
}(BaseObject));
export { AbstractLoadItem };
//# sourceMappingURL=AbstractLoadItem.js.map