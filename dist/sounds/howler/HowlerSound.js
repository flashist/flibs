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
import { Howl } from "howler";
import { AbstractSound } from "../abstract/AbstractSound";
var HowlerSound = /** @class */ (function (_super) {
    __extends(HowlerSound, _super);
    function HowlerSound(config) {
        return _super.call(this, config) || this;
    }
    HowlerSound.prototype.construction = function (config) {
        _super.prototype.construction.call(this, config);
        this.engineSound = new Howl({ src: this.config.src, preload: this.config.preload });
    };
    HowlerSound.prototype.destruction = function () {
        _super.prototype.destruction.call(this);
        if (this.engineSound) {
            this.engineSound.unload();
            this.engineSound = null;
        }
    };
    HowlerSound.prototype.getVolume = function () {
        return this.engineSound.volume();
    };
    HowlerSound.prototype.internalSetVolume = function (value) {
        this.engineSound.volume(value);
    };
    HowlerSound.prototype.play = function (config) {
        this.engineSound.loop(config.loop);
        this.engineSound.play();
    };
    HowlerSound.prototype.stop = function () {
        this.engineSound.stop();
    };
    return HowlerSound;
}(AbstractSound));
export { HowlerSound };
//# sourceMappingURL=HowlerSound.js.map