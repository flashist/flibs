import { Point } from "../../index";
var HtmlTools = /** @class */ (function () {
    function HtmlTools() {
    }
    HtmlTools.getDocumentSize = function () {
        return new Point(Math.max(document.documentElement.clientWidth, window.innerWidth), Math.max(document.documentElement.clientHeight, window.innerHeight));
    };
    return HtmlTools;
}());
export { HtmlTools };
//# sourceMappingURL=HtmlTools.js.map