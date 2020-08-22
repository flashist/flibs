import { FStage, Point } from "../../../../../index";
var FDisplayTools = /** @class */ (function () {
    function FDisplayTools() {
    }
    FDisplayTools.findStageInDisplayList = function (object) {
        var result;
        var tempParent = object.parent;
        while (tempParent) {
            if (FStage.isFStage(tempParent)) {
                result = tempParent;
                break;
            }
            else {
                tempParent = tempParent.parent;
            }
        }
        return result;
    };
    FDisplayTools.getObjectsUnderPoint = function (root, x, y) {
        var result;
        if (root.visible && root.renderable) {
            var rootContainer = root;
            // If the object is a container
            if (rootContainer.children && rootContainer.children.length > 0) {
                var tempChildren = [];
                var tempChild = void 0;
                var tempChildResult = void 0;
                var childrenCount = rootContainer.children.length;
                for (var childIndex = 0; childIndex < childrenCount; childIndex++) {
                    tempChild = rootContainer.children[childIndex];
                    tempChildResult = this.getObjectsUnderPoint(tempChild, x, y);
                    if (tempChildResult) {
                        tempChildren.push(tempChildResult);
                    }
                }
                // The container might be added only if at least one of its children is under cursor
                if (tempChildren.length > 0) {
                    result = { object: root, children: tempChildren };
                }
                // If the object isn't a container
            }
            else {
                var isUnderPoint = false;
                if (root.containsPoint) {
                    this.cachedPoint.x = x;
                    this.cachedPoint.y = y;
                    if (root.containsPoint(this.cachedPoint)) {
                        isUnderPoint = true;
                    }
                }
                else {
                    var tempBounds = root.getBounds();
                    if (tempBounds.contains(x, y)) {
                        isUnderPoint = true;
                    }
                }
                if (isUnderPoint) {
                    result = { object: root };
                }
            }
        }
        return result;
    };
    FDisplayTools.cachedPoint = new Point();
    return FDisplayTools;
}());
export { FDisplayTools };
//# sourceMappingURL=FDisplayTools.js.map