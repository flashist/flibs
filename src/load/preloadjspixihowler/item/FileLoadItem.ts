import {Loader} from "pixi.js";

import {IPreloadJSLoadCompleteEvent} from "./IPreloadJSLoadEvent";
import {AbstractLoadItem} from "../../abstract/item/AbstractLoadItem";

export class FileLoadItem<DataType extends any = any> extends AbstractLoadItem<DataType> {

    protected loader: Loader;

    protected progressBinding: any;
    protected completeBinding: any;
    protected errorBinding: any;

    protected internalPrepare(): void {
        this.loader = new Loader(this.config.basePath);
        this.loader.add(
            this.config.id,
            this.config.src
        );
    }

    protected internalStart():void {
        super.internalStart();

        this.loader.load();
    }

    protected internalStop():void {
        super.internalStop();

        if (this.loader) {
            this.loader.reset();
        }
    }

    protected addLoadingListeners(): void {
        super.addLoadingListeners();super.addLoadingListeners();

        this.progressBinding = this.loader.onProgress.add(
            (loader: Loader, resource: any) => {
                this.processLoadingProgress(loader.progress / 100);
            }
        );
        this.completeBinding = this.loader.onComplete.add(
            (loader: Loader, resourcesMap: {[key: string]: any}) => {
                for (let fileKey in resourcesMap) {
                    const tempFileItem = resourcesMap[fileKey];
                    this.processLoadingComplete(tempFileItem, tempFileItem.data);
                }
            }
        );
        this.errorBinding = this.loader.onError.add(
            (error: any, loader: Loader, resource: any) => {
                this.processLoadingError(
                    {
                        data: error,
                        errorCode: error.toString
                    }
                );
            }
        );
    }
}