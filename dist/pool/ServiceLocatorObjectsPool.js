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
import { ObjectsPool } from "@flashist/fcore";
import { getInstance } from "../index";
var ServiceLocatorObjectsPool = /** @class */ (function (_super) {
    __extends(ServiceLocatorObjectsPool, _super);
    function ServiceLocatorObjectsPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ServiceLocatorObjectsPool.prototype.createNewObject = function (ObjectClass) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return getInstance(ObjectClass);
    };
    return ServiceLocatorObjectsPool;
}(ObjectsPool));
export { ServiceLocatorObjectsPool };
//# sourceMappingURL=ServiceLocatorObjectsPool.js.map