var DisplayTools = /** @class */ (function () {
    function DisplayTools() {
    }
    DisplayTools.removeAllChildren = function (container) {
        while (container.children.length > 0) {
            container.removeChildAt(0);
        }
    };
    DisplayTools.childRemoveItselfFromParent = function (child) {
        if (!child || !child.parent) {
            return;
        }
        child.parent.removeChild(child);
    };
    DisplayTools.moveObjectToTopLayer = function (object) {
        if (!object || !object.parent) {
            return;
        }
        object.parent.setChildIndex(object, object.parent.children.length - 1);
    };
    DisplayTools.safeAddChildAt = function (container, child, index) {
        if (index < 0) {
            index = 0;
        }
        else if (index > container.children.length) {
            index = container.children.length;
        }
        container.addChildAt(child, index);
    };
    return DisplayTools;
}());
export { DisplayTools };
//# sourceMappingURL=DisplayTools.js.map