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
import { AssociativeArray, BaseObject } from "fcore";
import { Loader } from "./Loader";
import { DefaultLoadItemConfig } from "./item/DefaultLoadItemConfig";
import { LoadGroup } from "./group/LoadGroup";
import { LoadStatusPriorityTools } from "./loadstatus/LoadStatusPriorityTools";
var AbstractLoadManager = /** @class */ (function (_super) {
    __extends(AbstractLoadManager, _super);
    function AbstractLoadManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AbstractLoadManager.prototype.construction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.construction.apply(this, args);
        this.loadersToIdMap = new AssociativeArray();
        this.loadGroupsToNameMap = new AssociativeArray();
        this.addLoader(new Loader(DefaultLoadItemConfig.DEFAULT_LOADER_ID));
    };
    AbstractLoadManager.prototype.addLoader = function (loader) {
        this.loadersToIdMap.push(loader, loader.id);
        this.addLoaderListeners(loader);
    };
    AbstractLoadManager.prototype.getLoader = function (loaderId) {
        var result;
        if (loaderId) {
            result = this.loadersToIdMap.getItem(loaderId);
        }
        if (!result) {
            result = this.defaultLoader;
        }
        return result;
    };
    Object.defineProperty(AbstractLoadManager.prototype, "defaultLoader", {
        get: function () {
            return this.loadersToIdMap.getItem(DefaultLoadItemConfig.DEFAULT_LOADER_ID);
        },
        enumerable: false,
        configurable: true
    });
    AbstractLoadManager.prototype.getAllLoaders = function () {
        return this.loadersToIdMap.getAllItems().concat();
    };
    AbstractLoadManager.prototype.add = function (item) {
        DefaultLoadItemConfig.addDefaultData(item);
        var tempLoader = this.getLoader(item.loader);
        var loadItem = tempLoader.add(item);
        this.addItemToLoadGroups(loadItem);
        this.addItemListeners(loadItem);
        // this.updateLoadGroupStatusesForItem(loadItem);
        return loadItem;
    };
    AbstractLoadManager.prototype.addLoaderListeners = function (loader) {
        /*this.eventListenerHelper.addEventListener(
            loader,
            LoadEvent.PROGRESS,
            () => {
                this.dispatchEvent(LoadManagerEvent.LOADER_PROGRESS, loader.id);
            }
        );

        this.eventListenerHelper.addEventListener(
            loader,
            LoadEvent.COMPLETE,
            () => {
                this.dispatchEvent(LoadManagerEvent.LOADER_COMPLETE, loader.id);
            }
        );

        /!*this.eventListenerHelper.addEventListener(
            loader,
            LoaderEvent.ITEM_COMPLETE,
            (item: AbstractLoadItem) => {
                this.dispatchEvent(LoadManagerEvent.LOADER_ITEM_COMPLETE, loader.id, item);
            }
        );*!/

        this.eventListenerHelper.addEventListener(
            loader,
            LoadEvent.ERROR,
            (item: AbstractLoadItem) => {
                this.dispatchEvent(LoadManagerEvent.LOADER_ERROR, loader.id);
            }
        );*/
    };
    AbstractLoadManager.prototype.addItemListeners = function (item) {
        /*this.eventListenerHelper.addEventListener(
            item,
            LoadStatusEvent.STATUS_CHANGE,
            () => {
                this.updateLoadGroupStatusesForItem(item);
            }
        );*/
    };
    /*// Groups
    public getGroupStatus(group?: string): LoadStatus {
        let tempLoader: Loader = this.getLoader(group);
        return tempLoader.status;
    }*/
    AbstractLoadManager.prototype.getGroup = function (groupName) {
        var result = this.loadGroupsToNameMap.getItem(groupName);
        if (!result) {
            result = new LoadGroup(groupName);
            this.loadGroupsToNameMap.push(result, groupName);
        }
        return result;
    };
    AbstractLoadManager.prototype.addItemToLoadGroups = function (item) {
        for (var _i = 0, _a = item.config.loadGroups; _i < _a.length; _i++) {
            var groupName = _a[_i];
            var tempGroup = this.getGroup(groupName);
            tempGroup.addItem(item);
        }
    };
    /*protected updateLoadGroupStatusesForItem(item: AbstractLoadItem): void {
        for (let groupName of item.config.loadGroups) {
            const tempGroup: LoadGroup = this.getGroup(groupName);
            tempGroup.updateLoadStatus();
        }
    }

    protected triggerProgressEventForGroups(): void {
        for (let groupName of item.config.loadGroups) {
            const tempGroup: LoadGroup = this.getGroup(groupName);
            tempGroup.updateLoadStatus();
        }
    }*/
    AbstractLoadManager.prototype.getLoadStatusForGroups = function (groupNames) {
        var statuses = [];
        for (var _i = 0, groupNames_1 = groupNames; _i < groupNames_1.length; _i++) {
            var name_1 = groupNames_1[_i];
            var loadGroup = this.getGroup(name_1);
            statuses.push(loadGroup.status);
        }
        var result = LoadStatusPriorityTools.getTopPriorityStatus(statuses);
        return result;
    };
    return AbstractLoadManager;
}(BaseObject));
export { AbstractLoadManager };
//# sourceMappingURL=AbstractLoadManager.js.map