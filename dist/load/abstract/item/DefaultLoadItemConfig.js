import { ObjectTools } from "fcore";
var DefaultLoadItemConfig = /** @class */ (function () {
    function DefaultLoadItemConfig() {
        this.loader = DefaultLoadItemConfig.DEFAULT_LOADER_ID;
        this.loadWeight = DefaultLoadItemConfig.DEFAULT_LOAD_WEIGHT;
    }
    DefaultLoadItemConfig.addDefaultData = function (item) {
        ObjectTools.copyProps(item, DefaultLoadItemConfig.defaultLoadItem, {
            ignoreExistedProperties: true
        });
        // Default load groups
        if (!item.loadGroups) {
            item.loadGroups = [];
        }
        if (item.loadGroups) {
            item.loadGroups.push(DefaultLoadItemConfig.DEFAULT_LOAD_GROUP);
        }
    };
    DefaultLoadItemConfig.DEFAULT_LOADER_ID = "default";
    DefaultLoadItemConfig.DEFAULT_LOAD_WEIGHT = 1;
    DefaultLoadItemConfig.DEFAULT_LOAD_GROUP = "default";
    DefaultLoadItemConfig.defaultLoadItem = new DefaultLoadItemConfig();
    return DefaultLoadItemConfig;
}());
export { DefaultLoadItemConfig };
//# sourceMappingURL=DefaultLoadItemConfig.js.map