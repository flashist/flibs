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
import { Lock, AssociativeArray, BaseObject } from "fcore";
import { TweenLite } from "gsap";
import { SoundsManagerEvent } from "./SoundsManagerEvent";
var AbstractSoundsManager = /** @class */ (function (_super) {
    __extends(AbstractSoundsManager, _super);
    function AbstractSoundsManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.soundsToIdMap = new AssociativeArray();
        _this.disableLock = new Lock();
        _this._isMuted = false;
        _this._enabled = true;
        _this.defaultTweenTime = 0.5;
        _this.volume = 1;
        return _this;
    }
    AbstractSoundsManager.prototype.construction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.construction.apply(this, args);
        this.disableLock = new Lock();
        this.setVolume(this.volume);
    };
    AbstractSoundsManager.prototype.registerSound = function (id, sound) {
        this.soundsToIdMap.push(sound, id);
    };
    AbstractSoundsManager.prototype.getSound = function (id) {
        return this.soundsToIdMap.getItem(id);
    };
    AbstractSoundsManager.prototype.addDisableLock = function (locker) {
        this.disableLock.lock(locker);
        this.calculateEnabled();
    };
    AbstractSoundsManager.prototype.removeDisableLock = function (locker) {
        this.disableLock.unlock(locker);
        this.calculateEnabled();
    };
    Object.defineProperty(AbstractSoundsManager.prototype, "isMuted", {
        get: function () {
            return this._isMuted;
        },
        set: function (value) {
            if (value === this._isMuted) {
                return;
            }
            this._isMuted = value;
            this.dispatchEvent(SoundsManagerEvent.IS_MUTED_CHANGE);
            this.calculateEnabled();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractSoundsManager.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        enumerable: false,
        configurable: true
    });
    AbstractSoundsManager.prototype.calculateEnabled = function () {
        var prevEnabled = this.enabled;
        var newEnabled = !this.disableLock.isLocked && !this.isMuted;
        this._enabled = newEnabled;
        if (this.enabled !== prevEnabled) {
            this.dispatchEvent(SoundsManagerEvent.ENABLED_CHANGE);
        }
        this.commitData();
    };
    AbstractSoundsManager.prototype.commitData = function () {
        _super.prototype.commitData.call(this);
        var newVolume = 0;
        if (this.enabled) {
            newVolume = this.getVolume();
        }
        // this.internalSetVolume(newVolume);
        this.internalSetVolume(newVolume);
    };
    AbstractSoundsManager.prototype.getVolume = function () {
        return this.volume;
    };
    AbstractSoundsManager.prototype.setVolume = function (value) {
        TweenLite.killTweensOf(this);
        this.volume = value;
        this.dispatchEvent(SoundsManagerEvent.VOLUME_CHANGE);
        this.commitData();
    };
    AbstractSoundsManager.prototype.tweenVolume = function (volume, time, onComplete) {
        if (!time && time !== 0) {
            time = this.defaultTweenTime;
        }
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
    Object.defineProperty(AbstractSoundsManager.prototype, "tweenVolumeValue", {
        get: function () {
            return this._tweenVolumeValue;
        },
        set: function (value) {
            if (value === this._tweenVolumeValue) {
                return;
            }
            this._tweenVolumeValue = value;
            this.setVolume(this._tweenVolumeValue);
        },
        enumerable: false,
        configurable: true
    });
    return AbstractSoundsManager;
}(BaseObject));
export { AbstractSoundsManager };
//# sourceMappingURL=AbstractSoundsManager.js.map