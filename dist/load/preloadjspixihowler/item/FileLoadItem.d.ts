/// <reference types="preloadjs" />
import { IPreloadJSLoadCompleteEvent } from "./IPreloadJSLoadEvent";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
import 'createjs';
export declare class FileLoadItem extends AbstractLoadItem {
    protected queue: createjs.LoadQueue;
    protected internalPrepare(): void;
    protected internalStart(): void;
    protected internalStop(): void;
    protected addLoadingListeners(): void;
    protected onFileLoad(event: IPreloadJSLoadCompleteEvent): void;
    protected onProgress(event: createjs.ProgressEvent): void;
    protected onError(event: createjs.ErrorEvent): void;
}
