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
import { Command } from "@flashist/fcore";
import { getInstance, LoadManager, LoadStatus, LoadStatusEvent } from "../../..";
var WaitGroupLoadingCompleteCommand = /** @class */ (function (_super) {
    __extends(WaitGroupLoadingCompleteCommand, _super);
    function WaitGroupLoadingCompleteCommand(groupName) {
        var _this = _super.call(this) || this;
        _this.groupName = groupName;
        return _this;
    }
    WaitGroupLoadingCompleteCommand.prototype.executeInternal = function () {
        var _this = this;
        var loadManager = getInstance(LoadManager);
        var tempGroup = loadManager.getGroup(this.groupName);
        if (tempGroup.status === LoadStatus.COMPLETE) {
            this.notifyComplete();
        }
        else {
            this.eventListenerHelper.addEventListener(tempGroup, LoadStatusEvent.STATUS_CHANGE, function () {
                if (tempGroup.status === LoadStatus.COMPLETE) {
                    _this.notifyComplete();
                }
            });
        }
    };
    return WaitGroupLoadingCompleteCommand;
}(Command));
export { WaitGroupLoadingCompleteCommand };
//# sourceMappingURL=WaitGroupLoadingCompleteCommand.js.map