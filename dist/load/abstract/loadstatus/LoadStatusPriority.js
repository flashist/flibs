import { LoadStatus } from "./LoadStatus";
export var LoadStatusPriority = (function () {
    var result = {};
    result[LoadStatus.ERROR] = 0;
    result[LoadStatus.WAIT] = 1;
    result[LoadStatus.LOADING] = 2;
    result[LoadStatus.COMPLETE] = 3;
    return result;
})();
//# sourceMappingURL=LoadStatusPriority.js.map