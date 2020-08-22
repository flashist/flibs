import { AssociativeArray } from "fcore";
import { GenericObjectsModel } from "./GenericObjectsModel";
var GenericObjectsByTypeModel = /** @class */ (function () {
    function GenericObjectsByTypeModel() {
        this.modelsToTypeMap = new AssociativeArray();
    }
    GenericObjectsByTypeModel.prototype.commitItems = function (items) {
        var tempModel;
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var sourceItem = items_1[_i];
            tempModel = this.getModelForType(sourceItem.type);
            tempModel.parseSource(sourceItem);
        }
    };
    GenericObjectsByTypeModel.prototype.getModelForType = function (type) {
        var result = this.modelsToTypeMap.getItem(type);
        if (!result) {
            result = new GenericObjectsModel();
            result.itemsType = type;
            this.mapModelToType(result, type);
        }
        return result;
    };
    GenericObjectsByTypeModel.prototype.getItem = function (type, id) {
        var typeModel = this.getModelForType(type);
        return typeModel.getItem(id);
    };
    GenericObjectsByTypeModel.prototype.getItemsForType = function (type) {
        var typeModel = this.getModelForType(type);
        return typeModel.getAllItems();
    };
    GenericObjectsByTypeModel.prototype.mapModelToType = function (model, type) {
        this.modelsToTypeMap.push(model, type);
    };
    return GenericObjectsByTypeModel;
}());
export { GenericObjectsByTypeModel };
//# sourceMappingURL=GenericObjectsByTypeModel.js.map