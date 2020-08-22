import { GenericObjectsByTypeModel } from "./GenericObjectsByTypeModel";
import { getInstance } from "../..";
var GenericObjectsWithStaticTools = /** @class */ (function () {
    function GenericObjectsWithStaticTools() {
    }
    GenericObjectsWithStaticTools.getStaticObject = function (object) {
        var result;
        if (object.staticType) {
            var staticId = object.staticId;
            if (!staticId) {
                staticId = object.id;
            }
            var genericByTypeModel = getInstance(GenericObjectsByTypeModel);
            result = genericByTypeModel.getItem(object.staticType, staticId);
        }
        return result;
    };
    return GenericObjectsWithStaticTools;
}());
export { GenericObjectsWithStaticTools };
//# sourceMappingURL=GenericObjectsWithStaticTools.js.map