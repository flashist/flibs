import { Logger } from "fcore";
import { TextTruncateType } from "../../../../index";
var TextTools = /** @class */ (function () {
    function TextTools() {
    }
    TextTools.truncateToFit = function (field, maxWidth, maxHeight, truncateType, afterTruncateText) {
        if (truncateType === void 0) { truncateType = TextTruncateType.FROM_RIGHT; }
        if (afterTruncateText === void 0) { afterTruncateText = "..."; }
        if (!maxWidth || field.width <= maxWidth) {
            maxWidth = field.width;
        }
        if (!maxHeight || field.height <= maxHeight) {
            maxHeight = field.height;
        }
        if (!field.text || (field.textWidth <= maxWidth && field.textHeight <= maxHeight)) {
            return false;
        }
        var text = field.text;
        var cached = text;
        var maxSteps = 1000;
        var step = 0;
        while (text.length > 0 &&
            ((field.textWidth > maxWidth) || (field.textHeight > maxHeight))) {
            if (truncateType === TextTruncateType.FROM_LEFT) {
                text = text.substring(1, text.length);
                field.text = afterTruncateText + text;
            }
            else {
                text = text.substring(0, text.length - 1);
                field.text = text + afterTruncateText;
            }
            // Preventing code from "stucking"
            step++;
            if (step >= maxSteps) {
                Logger.error("TextTools | truncateToFit __ ERROR! Max steps count!");
                break;
            }
        }
        return text !== cached;
    };
    ;
    return TextTools;
}());
export { TextTools };
//# sourceMappingURL=TextTools.js.map