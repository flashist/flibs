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
import { Loader } from "pixi.js";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
var PixiImageLoadItem = /** @class */ (function (_super) {
    __extends(PixiImageLoadItem, _super);
    function PixiImageLoadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PixiImageLoadItem.prototype.internalPrepare = function () {
        this.loader = new Loader(this.config.basePath);
        this.loader.add(this.config.id, this.config.src);
    };
    PixiImageLoadItem.prototype.internalStart = function () {
        _super.prototype.internalStart.call(this);
        this.loader.load();
    };
    PixiImageLoadItem.prototype.internalStop = function () {
        _super.prototype.internalStop.call(this);
        if (this.loader) {
            this.loader.reset();
        }
    };
    PixiImageLoadItem.prototype.addLoadingListeners = function () {
        var _this = this;
        _super.prototype.addLoadingListeners.call(this);
        this.progressBinding = this.loader.onProgress.add(function (loader, resource) {
            _this.processLoadingProgress(loader.progress / 100);
        });
        /*this.fileCompleteBinding = this.loader.onLoad.add(
            (loader: loaders.Loader, resource: loaders.Resource) => {
                console.log(args);
            }
        );*/
        this.completeBinding = this.loader.onComplete.add(function (loader, resourcesMap) {
            _this.processLoadingComplete(resourcesMap);
        });
        this.errorBinding = this.loader.onError.add(function (error, loader, resource) {
            _this.processLoadingError({
                data: error,
                errorCode: error.toString
            });
        });
    };
    PixiImageLoadItem.prototype.removeLoadingListeners = function () {
        _super.prototype.removeLoadingListeners.call(this);
        if (!this.loader) {
            return;
        }
        this.loader.onProgress.detach(this.progressBinding);
        // this.loader.onLoad.detach(this.fileCompleteBinding);
        this.loader.onComplete.detach(this.completeBinding);
        this.loader.onError.detach(this.errorBinding);
    };
    return PixiImageLoadItem;
}(AbstractLoadItem));
export { PixiImageLoadItem };
//# sourceMappingURL=PixiImageLoadItem.js.map