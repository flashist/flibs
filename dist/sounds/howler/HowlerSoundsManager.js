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
import { Howler } from "howler";
import { AbstractSoundsManager } from "../../index";
var HowlerSoundsManager = /** @class */ (function (_super) {
    __extends(HowlerSoundsManager, _super);
    function HowlerSoundsManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HowlerSoundsManager.prototype.internalSetVolume = function (value) {
        Howler.volume(value);
    };
    return HowlerSoundsManager;
}(AbstractSoundsManager));
export { HowlerSoundsManager };
//# sourceMappingURL=HowlerSoundsManager.js.map