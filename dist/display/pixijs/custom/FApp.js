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
import { App } from "../../../index";
var FApp = /** @class */ (function (_super) {
    __extends(FApp, _super);
    function FApp(options) {
        var _this = _super.call(this, options) || this;
        _this.options = options;
        _this.lastTimeRendered = 0;
        _this.options = options;
        if (!_this.options) {
            _this.options = {};
        }
        if (_this.options.targetFps) {
            _this.fpsLimitterEnabled = true;
            _this.targetRenderInterval = 1000 / _this.options.targetFps;
        }
        FApp._instance = _this;
        // FStage
        _this.stage.isFStage = true;
        return _this;
    }
    FApp.prototype.render = function (force) {
        if (!force && this.fpsLimitterEnabled) {
            var tempDelta = Date.now() - this.lastTimeRendered;
            if (tempDelta >= this.targetRenderInterval) {
                this.lastTimeRendered = Date.now();
                _super.prototype.render.call(this);
            }
        }
        else {
            _super.prototype.render.call(this);
        }
    };
    FApp.prototype.getGlobalInteractionPosition = function () {
        // return (this.renderer.plugins as RendererPlugins).interaction.mouse.global;
        return this.renderer.plugins.interaction.eventData.data.global.clone();
    };
    Object.defineProperty(FApp, "instance", {
        get: function () {
            return FApp._instance;
        },
        enumerable: false,
        configurable: true
    });
    return FApp;
}(App));
export { FApp };
//# sourceMappingURL=FApp.js.map