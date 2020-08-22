var DisplayResizeTools = /** @class */ (function () {
    function DisplayResizeTools() {
    }
    DisplayResizeTools.scaleObject = function (object, width, height, config) {
        var tempScale = DisplayResizeTools.getScale(object.width, object.height, width, height, config);
        object.scale.set(tempScale, tempScale);
    };
    DisplayResizeTools.getScale = function (origWidth, origHeight, targetWidth, targetHeight, config) {
        var result = 1;
        if (!config) {
            config = {};
        }
        if (targetWidth > 0 && targetHeight > 0) {
            if (config.upscaleAllowed || origWidth > targetWidth || origHeight > targetHeight) {
                var maxDelta = targetWidth / targetHeight;
                var objDelta = origWidth / origHeight;
                if ((objDelta <= maxDelta && config.scaleByMinSide) || (objDelta > maxDelta && !config.scaleByMinSide)) {
                    /*object.width = width;
                    object.scale.y = object.scale.x;*/
                    result = targetWidth / origWidth;
                }
                else {
                    /*object.height = height;
                    object.scale.x = object.scale.y;*/
                    result = targetHeight / origHeight;
                }
            }
        }
        return result;
    };
    return DisplayResizeTools;
}());
export { DisplayResizeTools };
//# sourceMappingURL=DisplayResizeTools.js.map