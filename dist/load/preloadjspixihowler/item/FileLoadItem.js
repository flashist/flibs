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
import { PreloadjsLoadQueueEventType } from "./PreloadjsLoadQueueEventType";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
import 'createjs';
var FileLoadItem = /** @class */ (function (_super) {
    __extends(FileLoadItem, _super);
    function FileLoadItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FileLoadItem.prototype.internalPrepare = function () {
        this.queue = new createjs.LoadQueue(false, this.config.basePath);
        this.queue.loadFile(this.config.src, false);
    };
    FileLoadItem.prototype.internalStart = function () {
        _super.prototype.internalStart.call(this);
        this.queue.load();
    };
    FileLoadItem.prototype.internalStop = function () {
        _super.prototype.internalStop.call(this);
        if (this.queue) {
            this.queue.setPaused(true);
        }
    };
    FileLoadItem.prototype.addLoadingListeners = function () {
        _super.prototype.addLoadingListeners.call(this);
        this.eventListenerHelper.addEventListener(this.queue, PreloadjsLoadQueueEventType.FILE_LOAD, this.onFileLoad);
        this.eventListenerHelper.addEventListener(this.queue, PreloadjsLoadQueueEventType.PROGRESS, this.onProgress);
        this.eventListenerHelper.addEventListener(this.queue, PreloadjsLoadQueueEventType.ERROR, this.onError);
    };
    FileLoadItem.prototype.onFileLoad = function (event) {
        this.processLoadingComplete(event.result);
    };
    FileLoadItem.prototype.onProgress = function (event) {
        this.processLoadingProgress(event.progress);
    };
    FileLoadItem.prototype.onError = function (event) {
        this.processLoadingError({
            data: event.data,
            errorCode: event.title
        });
    };
    return FileLoadItem;
}(AbstractLoadItem));
export { FileLoadItem };
//# sourceMappingURL=FileLoadItem.js.map