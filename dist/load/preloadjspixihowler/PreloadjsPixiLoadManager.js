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
import { AbstractLoadManager } from "../abstract/AbstractLoadManager";
import { AbstractLoadFactory } from "../abstract/AbstractLoadFactory";
import { PreloadjsPixiLoadFactory } from "./PreloadjsPixiLoadFactory";
var PreloadjsPixiLoadManager = /** @class */ (function (_super) {
    __extends(PreloadjsPixiLoadManager, _super);
    function PreloadjsPixiLoadManager() {
        var _this = _super.call(this) || this;
        AbstractLoadFactory.instance = new PreloadjsPixiLoadFactory();
        return _this;
    }
    return PreloadjsPixiLoadManager;
}(AbstractLoadManager));
export { PreloadjsPixiLoadManager };
//# sourceMappingURL=PreloadjsPixiLoadManager.js.map