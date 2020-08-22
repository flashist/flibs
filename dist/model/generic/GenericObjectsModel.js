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
import { BaseDataVO } from "../..";
import { GenericObjectChangeActionType } from "./GenericObjectChangeActionType";
var GenericObjectsModel = /** @class */ (function (_super) {
    __extends(GenericObjectsModel, _super);
    function GenericObjectsModel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.items = new AssociativeArray();
        return _this;
    }
    GenericObjectsModel.prototype.construction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.construction.apply(this, args);
        this.DefaultItemClass = BaseDataVO;
    };
    GenericObjectsModel.prototype.parseSource = function (source) {
        switch (source.action) {
            case GenericObjectChangeActionType.REMOVE:
                this.removeItem(source.id);
                break;
            //case ChangeActionType.UPDATE:
            default:
                this.updateItem(this.getItem(source.id), source);
                break;
        }
    };
    GenericObjectsModel.prototype.getItem = function (id, isNeedToCreate) {
        if (isNeedToCreate === void 0) { isNeedToCreate = true; }
        var result = this.items.getItem(id);
        if (!result) {
            if (isNeedToCreate) {
                result = this.createEmpty(id);
                this.items.push(result, result.id);
            }
        }
        return result;
    };
    GenericObjectsModel.prototype.removeItem = function (id) {
        this.items.removeByKey(id);
    };
    Object.defineProperty(GenericObjectsModel.prototype, "itemsCount", {
        get: function () {
            return this.items.length;
        },
        enumerable: false,
        configurable: true
    });
    GenericObjectsModel.prototype.createEmpty = function (id) {
        var result;
        var initSourceData = { id: id, type: this.itemsType };
        if (this.DefaultItemClass) {
            result = new this.DefaultItemClass();
        }
        else {
            result = initSourceData;
        }
        this.updateItem(result, initSourceData);
        return result;
    };
    GenericObjectsModel.prototype.updateItem = function (item, source) {
        if (item.update) {
            item.update(source);
        }
        else {
            Object.assign(item, source);
        }
    };
    GenericObjectsModel.prototype.getAllItems = function () {
        return this.items.getAllItems();
    };
    return GenericObjectsModel;
}(BaseObject));
export { GenericObjectsModel };
//# sourceMappingURL=GenericObjectsModel.js.map