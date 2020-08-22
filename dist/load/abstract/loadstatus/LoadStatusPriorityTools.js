import { LoadStatus } from "./LoadStatus";
import { LoadStatusPriority } from "./LoadStatusPriority";
var LoadStatusPriorityTools = /** @class */ (function () {
    function LoadStatusPriorityTools() {
    }
    LoadStatusPriorityTools.getTopPriorityStatus = function (statuses) {
        var result;
        var lastLoadStatusPriority;
        for (var _i = 0, statuses_1 = statuses; _i < statuses_1.length; _i++) {
            var singleStatus = statuses_1[_i];
            var statusPriority = LoadStatusPriority[singleStatus];
            if (!lastLoadStatusPriority || lastLoadStatusPriority > statusPriority) {
                result = singleStatus;
                lastLoadStatusPriority = statusPriority;
            }
            // If any of status is an ERROR status, stop checking, as it's the top possible priority status
            if (result === LoadStatus.ERROR) {
                break;
            }
        }
        return result;
    };
    return LoadStatusPriorityTools;
}());
export { LoadStatusPriorityTools };
//# sourceMappingURL=LoadStatusPriorityTools.js.map