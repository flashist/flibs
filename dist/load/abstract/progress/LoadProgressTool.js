import { LoadStatus } from "../../..";
var LoadProgressTool = /** @class */ (function () {
    function LoadProgressTool() {
    }
    LoadProgressTool.getProgressForItems = function (items) {
        var totalWeight = 0;
        var loadedWeight = 0;
        var tempItemWeight;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var singleItem = items_1[_i];
            tempItemWeight = singleItem.config.loadWeight;
            if (!tempItemWeight) {
                tempItemWeight = 1;
            }
            totalWeight += tempItemWeight;
            if (singleItem.status === LoadStatus.COMPLETE || singleItem.status === LoadStatus.ERROR) {
                loadedWeight += tempItemWeight;
            }
        }
        var progress = loadedWeight / totalWeight;
        var result = {
            progress: progress,
            loadedWeight: loadedWeight,
            totalWeight: totalWeight
        };
        return result;
    };
    return LoadProgressTool;
}());
export { LoadProgressTool };
//# sourceMappingURL=LoadProgressTool.js.map