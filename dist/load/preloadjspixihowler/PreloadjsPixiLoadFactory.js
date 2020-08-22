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
import { AbstractLoadFactory } from "../abstract/AbstractLoadFactory";
import { FileLoadItem } from "./item/FileLoadItem";
import { FileType } from "../abstract/data/FileType";
import { PixiImageLoadItem } from "./item/PixiImageLoadItem";
import { FontLoadItem } from "./item/FontLoadItem";
import { HowlerSoundLoadItem } from "./item/HowlerSoundLoadItem";
var PreloadjsPixiLoadFactory = /** @class */ (function (_super) {
    __extends(PreloadjsPixiLoadFactory, _super);
    function PreloadjsPixiLoadFactory() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreloadjsPixiLoadFactory.prototype.createItem = function (config) {
        // Only FileLoadItem, until other loaders are implemented
        var result;
        if (this.basePath) {
            config.basePath = this.basePath;
        }
        switch (config.fileType) {
            case FileType.IMAGE:
            case FileType.SPRITESHEET:
                result = new PixiImageLoadItem(config);
                break;
            case FileType.FONT:
                result = new FontLoadItem(config);
                break;
            case FileType.SOUND:
                result = new HowlerSoundLoadItem(config);
                break;
            default:
                result = new FileLoadItem(config);
        }
        return result;
    };
    return PreloadjsPixiLoadFactory;
}(AbstractLoadFactory));
export { PreloadjsPixiLoadFactory };
//# sourceMappingURL=PreloadjsPixiLoadFactory.js.map