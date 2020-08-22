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
import { DisplayObjectContainer } from "../../../../index";
var FStage = /** @class */ (function (_super) {
    __extends(FStage, _super);
    function FStage() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isFStage = true;
        return _this;
    }
    FStage.isFStage = function (object) {
        return object.isFStage;
    };
    return FStage;
}(DisplayObjectContainer));
export { FStage };
//# sourceMappingURL=FStage.js.map