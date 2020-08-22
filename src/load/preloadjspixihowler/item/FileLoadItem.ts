import {PreloadjsLoadQueueEventType} from "./PreloadjsLoadQueueEventType";
import {IPreloadJSLoadCompleteEvent} from "./IPreloadJSLoadEvent";
import {AbstractLoadItem} from "../../abstract/item/AbstractLoadItem";

import 'createjs';

export class FileLoadItem extends AbstractLoadItem {

    protected queue: createjs.LoadQueue;

    protected internalPrepare(): void {
        this.queue = new createjs.LoadQueue(
            false,
            this.config.basePath
        );
        this.queue.loadFile(
            this.config.src,
            false
        );
    }

    protected internalStart():void {
        super.internalStart();

        this.queue.load();
    }

    protected internalStop():void {
        super.internalStop();

        if (this.queue) {
            this.queue.setPaused(true);
        }
    }

    protected addLoadingListeners(): void {
        super.addLoadingListeners();

        this.eventListenerHelper.addEventListener(
            this.queue,
            PreloadjsLoadQueueEventType.FILE_LOAD,
            this.onFileLoad
        );
        this.eventListenerHelper.addEventListener(
            this.queue,
            PreloadjsLoadQueueEventType.PROGRESS,
            this.onProgress
        );
        this.eventListenerHelper.addEventListener(
            this.queue,
            PreloadjsLoadQueueEventType.ERROR,
            this.onError
        );
    }

    protected onFileLoad(event: IPreloadJSLoadCompleteEvent): void {
        this.processLoadingComplete(event.result);
    }

    protected onProgress(event: createjs.ProgressEvent): void {
        this.processLoadingProgress(event.progress);
    }

    protected onError(event: createjs.ErrorEvent): void {
        this.processLoadingError(
            {
                data: event.data,
                errorCode: event.title
            }
        );
    }
}