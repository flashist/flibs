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
import { StringTools } from "@flashist/fcore";
import { HowlerSound } from "../../../sounds/howler/HowlerSound";
import { HowlerSoundEvent } from "../../../sounds/howler/HowlerSoundEvent";
import { AbstractSoundLoadItem } from "../../abstract/item/AbstractSoundLoadItem";
import { getInstance, SoundsManager } from "../../../index";
var HowlerSoundLoadItem = /** @class */ (function (_super) {
    __extends(HowlerSoundLoadItem, _super);
    function HowlerSoundLoadItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // TODO: figure out how it would be possible to separate sounds and loading-sounds classes,
        // at least without using injection, as injection might not be prepared for the sounds manager
        // if we remove injection here, we might add injection to the sounds manager itself,
        // but it would not resolve the problem, only relocate it
        _this.soundsManager = getInstance(SoundsManager);
        return _this;
    }
    HowlerSoundLoadItem.prototype.internalPrepare = function () {
        _super.prototype.internalPrepare.call(this);
        var src = this.config.src;
        if (this.config.extensions && this.config.extensions.length) {
            src = [];
            var extCount = this.config.extensions.length;
            for (var extIndex = 0; extIndex < extCount; extIndex++) {
                src.push(StringTools.substitute(this.config.src, {
                    extension: this.config.extensions[extIndex]
                }));
            }
        }
        this.sound = new HowlerSound({
            id: this.config.id,
            src: src,
            preload: false
        });
    };
    HowlerSoundLoadItem.prototype.internalStart = function () {
        _super.prototype.internalStart.call(this);
        this.sound.engineSound.load();
    };
    HowlerSoundLoadItem.prototype.internalStop = function () {
        _super.prototype.internalStop.call(this);
        if (this.sound) {
            this.sound.destruction();
        }
    };
    HowlerSoundLoadItem.prototype.addLoadingListeners = function () {
        var _this = this;
        _super.prototype.addLoadingListeners.call(this);
        /*this.fileCompleteBinding = this.loader.onLoad.add(
            (loader: loaders.Loader, resource: loaders.Resource) => {
                console.log(args);
            }
        );*/
        this.sound.engineSound.on(HowlerSoundEvent.LOAD, function () {
            _this.processLoadingComplete(_this.sound.engineSound);
        });
        /*this.completeBinding = this.sound.onComplete.add(
            (loader: PIXI.loaders.Loader, resourcesMap: {[key: string]: PIXI.loaders.Resource}) => {
                this.processLoadingComplete(resourcesMap);
            }
        );*/
        /*this.errorBinding = this.sound.onError.add(
            (error: any, loader: PIXI.loaders.Loader, resource: PIXI.loaders.Resource) => {
                this.processLoadingError(
                    {
                        data: error,
                        errorCode: error.toString
                    }
                );
            }
        );*/
        this.sound.engineSound.on(HowlerSoundEvent.LOAD_ERROR, function (soundId, error) {
            _this.processLoadingError({ errorCode: error, data: error });
        });
    };
    HowlerSoundLoadItem.prototype.removeLoadingListeners = function () {
        _super.prototype.removeLoadingListeners.call(this);
        if (!this.sound) {
            return;
        }
        /*this.sound.onProgress.detach(this.progressBinding);
        // this.loader.onLoad.detach(this.fileCompleteBinding);
        this.sound.onComplete.detach(this.completeBinding);
        this.sound.onError.detach(this.errorBinding);*/
        this.sound.engineSound.off(HowlerSoundEvent.LOAD);
        this.sound.engineSound.off(HowlerSoundEvent.LOAD_ERROR);
    };
    HowlerSoundLoadItem.prototype.processLoadingComplete = function (data) {
        _super.prototype.processLoadingComplete.call(this, data);
        this.soundsManager.registerSound(this.config.id, this.sound);
    };
    return HowlerSoundLoadItem;
}(AbstractSoundLoadItem));
export { HowlerSoundLoadItem };
//# sourceMappingURL=HowlerSoundLoadItem.js.map