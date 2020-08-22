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
import { BaseObject } from "@flashist/fcore";
import { TweenLite } from "gsap";
var AbstractSound = /** @class */ (function (_super) {
    __extends(AbstractSound, _super);
    function AbstractSound(config) {
        return _super.call(this, config) || this;
    }
    AbstractSound.prototype.construction = function (config) {
        _super.prototype.construction.call(this);
        this.config = config;
    };
    AbstractSound.prototype.setVolume = function (value) {
        TweenLite.killTweensOf(this);
        this.internalSetVolume(value);
    };
    AbstractSound.prototype.tweenVolume = function (volume, time, onComplete) {
        this.tweenVolumeValue = this.getVolume();
        TweenLite.killTweensOf(this);
        TweenLite.to(this, time, {
            tweenVolumeValue: volume,
            onComplete: function () {
                if (onComplete) {
                    onComplete();
                }
            }
        });
    };
    Object.defineProperty(AbstractSound.prototype, "tweenVolumeValue", {
        get: function () {
            return this._tweenVolumeValue;
        },
        set: function (value) {
            if (value === this._tweenVolumeValue) {
                return;
            }
            this._tweenVolumeValue = value;
            this.internalSetVolume(this._tweenVolumeValue);
        },
        enumerable: false,
        configurable: true
    });
    return AbstractSound;
}(BaseObject));
export { AbstractSound };
//# sourceMappingURL=AbstractSound.js.map