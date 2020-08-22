import {Loader} from "pixi.js";

import {AbstractLoadItem} from "../../abstract/item/AbstractLoadItem";

export class PixiImageLoadItem extends AbstractLoadItem {

    protected loader: Loader;

    protected progressBinding: any;
    protected fileCompleteBinding: any;
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
        super.addLoadingListeners();

        this.progressBinding = this.loader.onProgress.add(
            (loader: Loader, resource: any) => {
                this.processLoadingProgress(loader.progress / 100);
            }
        );
        /*this.fileCompleteBinding = this.loader.onLoad.add(
            (loader: loaders.Loader, resource: loaders.Resource) => {
                console.log(args);
            }
        );*/
        this.completeBinding = this.loader.onComplete.add(
            (loader: Loader, resourcesMap: {[key: string]: any}) => {
                this.processLoadingComplete(resourcesMap);
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

    protected removeLoadingListeners(): void {
        super.removeLoadingListeners();

        if (!this.loader) {
            return;
        }

        this.loader.onProgress.detach(this.progressBinding);
        // this.loader.onLoad.detach(this.fileCompleteBinding);
        this.loader.onComplete.detach(this.completeBinding);
        this.loader.onError.detach(this.errorBinding);
    }
}