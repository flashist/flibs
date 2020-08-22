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
import { Command } from "fcore";
import { getInstance, LoadManager, LoadStatus, LoadStatusEvent } from "../../..";
var LoadItemCommand = /** @class */ (function (_super) {
    __extends(LoadItemCommand, _super);
    function LoadItemCommand(loadConfig) {
        var _this = _super.call(this) || this;
        _this.loadConfig = loadConfig;
        return _this;
    }
    LoadItemCommand.prototype.executeInternal = function () {
        var _this = this;
        var loadManager = getInstance(LoadManager);
        this.loadItem = loadManager.add(this.loadConfig);
        this.eventListenerHelper.addEventListener(this.loadItem, LoadStatusEvent.STATUS_CHANGE, function () {
            _this.processFinalStatus();
        });
        this.processFinalStatus();
    };
    LoadItemCommand.prototype.processFinalStatus = function () {
        if (this.loadItem.status === LoadStatus.COMPLETE) {
            this.processComplete();
        }
        else if (this.loadItem.status === LoadStatus.ERROR) {
            this.processError();
        }
    };
    LoadItemCommand.prototype.processComplete = function () {
        this.notifyComplete(this.loadItem.data);
    };
    LoadItemCommand.prototype.processError = function () {
        this.notifyComplete(null, this.loadItem.errorData);
    };
    return LoadItemCommand;
}(Command));
export { LoadItemCommand };
//# sourceMappingURL=LoadItemCommand.js.map