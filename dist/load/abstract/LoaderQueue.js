import { AssociativeArray } from "fcore";
import { LoadTools } from "../tools/LoadTools";
var LoaderQueue = /** @class */ (function () {
    function LoaderQueue() {
        this.items = new AssociativeArray();
        this.itemsToLoad = new AssociativeArray();
        this.loadedItems = new AssociativeArray();
    }
    LoaderQueue.prototype.add = function (item) {
        this.isNeedSort = true;
        this.items.push(item, LoadTools.getUniqueLoadingId(item.config));
        this.itemsToLoad.push(item, LoadTools.getUniqueLoadingId(item.config));
    };
    LoaderQueue.prototype.get = function (config) {
        var tempId = LoadTools.getUniqueLoadingId(config);
        return this.items.getItem(tempId);
    };
    LoaderQueue.prototype.getNextToLoad = function () {
        if (this.isNeedSort) {
            this.sortItems();
        }
        return this.itemsToLoad.getItemByIndex(0);
    };
    LoaderQueue.prototype.sortItems = function () {
        this.itemsToLoad.sort(function (item1, item2) {
            var result = 0;
            if (item1.config.priority && item2.config.priority) {
                if (item1.config.priority > item2.config.priority) {
                    result = -1;
                }
                else if (item1.config.priority < item2.config.priority) {
                    result = 1;
                }
            }
            return result;
        });
    };
    LoaderQueue.prototype.onItemLoad = function (item) {
        if (this.items.indexOf(item) === -1) {
            return;
        }
        this.itemsToLoad.remove(item);
        this.loadedItems.push(item, LoadTools.getUniqueLoadingId(item.config));
    };
    return LoaderQueue;
}());
export { LoaderQueue };
//# sourceMappingURL=LoaderQueue.js.map