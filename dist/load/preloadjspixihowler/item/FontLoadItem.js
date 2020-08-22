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
import * as WebFont from "webfontloader";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
var FontLoadItem = /** @class */ (function (_super) {
    __extends(FontLoadItem, _super);
    function FontLoadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FontLoadItem.prototype.internalPrepare = function () {
        _super.prototype.internalPrepare.call(this);
        // Applying CSS to HTML
        var style = document.createElement("style");
        style.type = "text/css";
        document.getElementsByTagName('head')[0].appendChild(style);
        var fontRule = this.generateFontFaceRule();
        style.sheet.insertRule(fontRule);
        this.fontLoadingConfig = {
            custom: {
                families: [this.config.fontFace["font-family"]]
            }
        };
    };
    FontLoadItem.prototype.internalStart = function () {
        _super.prototype.internalStart.call(this);
        WebFont.load(this.fontLoadingConfig);
    };
    FontLoadItem.prototype.internalStop = function () {
        _super.prototype.internalStop.call(this);
        // TODO: find a way to stop font loading, not sure it's possible, for now could be ignored
    };
    FontLoadItem.prototype.addLoadingListeners = function () {
        var _this = this;
        _super.prototype.addLoadingListeners.call(this);
        this.fontLoadingConfig.fontloading = function (familyName, fontValidationDescription) {
            console.log("FontLoadItem | fontloading __ familyName: ", familyName);
        };
        this.fontLoadingConfig.fontactive = function (familyName, fontValidationDescription) {
            console.log("FontLoadItem | fontactive __ familyName: ", familyName);
            /*setTimeout(
                () => {
                    this.processLoadingComplete(familyName);
                },
                5000
            );*/
            _this.processLoadingComplete(familyName);
        };
        this.fontLoadingConfig.fontinactive = function (familyName, fontValidationDescription) {
            console.log("FontLoadItem | fontinactive __ familyName: ", familyName);
            _this.processLoadingError({
                data: familyName
            });
        };
    };
    FontLoadItem.prototype.generateFontFaceRule = function () {
        var filepathWithoutExtension = this.config.src;
        var lastDotIndex = filepathWithoutExtension.lastIndexOf('.');
        if (lastDotIndex >= 0) {
            filepathWithoutExtension = filepathWithoutExtension.substring(0, lastDotIndex);
        }
        var result = "@font-face {\n            src: url('" + filepathWithoutExtension + ".eot');\n            src: url('" + filepathWithoutExtension + ".woff2') format('woff2'),\n                url('" + filepathWithoutExtension + ".woff') format('woff'),\n                url('" + filepathWithoutExtension + ".ttf') format('truetype'),\n                url('" + filepathWithoutExtension + ".svg#Rochester-Regular') format('svg'),\n                url('" + filepathWithoutExtension + ".eot?#iefix') format('embedded-opentype');";
        for (var propName in this.config.fontFace) {
            if (propName == "font-family") {
                result += propName + ": \"" + this.config.fontFace[propName] + "\"";
            }
            else {
                result += propName + ": " + this.config.fontFace[propName];
            }
        }
        result += "}";
        return result;
    };
    return FontLoadItem;
}(AbstractLoadItem));
export { FontLoadItem };
//# sourceMappingURL=FontLoadItem.js.map