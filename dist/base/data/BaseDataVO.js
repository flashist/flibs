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
import { ObjectTools, BaseEventDispatcher } from "@flashist/fcore";
import { BaseDataVOEvent } from "./BaseDataVOEvent";
var BaseDataVO = /** @class */ (function (_super) {
    __extends(BaseDataVO, _super);
    function BaseDataVO() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = "";
        _this.id = "";
        return _this;
    }
    BaseDataVO.prototype.update = function (source) {
        var isChanged = ObjectTools.copyProps(this, source);
        if (isChanged) {
            this.dispatchEvent(BaseDataVOEvent.CHANGE);
        }
    };
    return BaseDataVO;
}(BaseEventDispatcher));
export { BaseDataVO };
//# sourceMappingURL=BaseDataVO.js.map