import { Loader, Assets } from "pixi.js";

import { IPreloadJSLoadCompleteEvent } from "./IPreloadJSLoadEvent";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";

export class FileLoadItem<DataType extends any = any> extends AbstractLoadItem<DataType> {

    // protected loader: Loader;

    protected progressBinding: any;
    protected completeBinding: any;
    protected errorBinding: any;

    protected listenersEnabled: boolean;
    protected loadPromise: Promise<Record<string, any>>;

    protected internalPrepare(): void {
        // this.loader = new Loader(this.config.basePath);
        // this.loader.add(
        //     this.config.id,
        //     this.config.src
        // );

        const tempUrl: URL = new URL(this.config.src, this.config.basePath);
        // Assets.add({ alias: this.config.id, src: tempUrl.href });
        Assets.add(this.config.id, tempUrl.href);
    }

    protected internalStart(): void {
        super.internalStart();

        this.loadPromise = Assets.load(
            this.config.id,
            (progress: number) => {
                if (!this.listenersEnabled) {
                    return;
                }

                this.processLoadingProgress(progress / 100);
            }
        );

        this.loadPromise.then(
            (resourcesMap: { [key: string]: any }) => {
                if (!this.listenersEnabled) {
                    return;
                }

                this.onLoaderComplete(resourcesMap);
            }
        );

        this.loadPromise.catch(
            (error: any) => {
                if (!this.listenersEnabled) {
                    return;
                }

                this.processLoadingError(
                    {
                        data: error,
                        errorCode: error.toString
                    }
                );
            }
        );
    }

    protected internalStop(): void {
        super.internalStop();

        // if (this.loader) {
        //     this.loader.reset();
        // }
        console.warn("FileLoadItem | internalStop __ WARNING! Stop loading is not implemented!");
    }

    protected addLoadingListeners(): void {
        super.addLoadingListeners();

        this.listenersEnabled = true;

        // this.progressBinding = this.loader.onProgress.add(
        //     (loader: Loader, resource: any) => {
        //         this.processLoadingProgress(loader.progress / 100);
        //     }
        // );
        // this.completeBinding = this.loader.onComplete.add(
        //     (loader: Loader, resourcesMap: { [key: string]: any }) => {
        //         this.onLoaderComplete(resourcesMap);
        //     }
        // );
        // this.errorBinding = this.loader.onError.add(
        //     (error: any, loader: Loader, resource: any) => {
        //         this.processLoadingError(
        //             {
        //                 data: error,
        //                 errorCode: error.toString
        //             }
        //         );
        //     }
        // );
    }

    protected removeLoadingListeners(): void {
        super.removeLoadingListeners();

        this.listenersEnabled = false;

        // if (!this.loader) {
        //     return;
        // }

        // this.loader.onProgress.detach(this.progressBinding);
        // // this.loader.onLoad.detach(this.fileCompleteBinding);
        // this.loader.onComplete.detach(this.completeBinding);
        // this.loader.onError.detach(this.errorBinding);
    }

    protected onLoaderComplete(resourcesMap: { [key: string]: any }): void {
        for (let fileKey in resourcesMap) {
            const tempFileItem = resourcesMap[fileKey];
            this.processLoadingComplete(tempFileItem, tempFileItem.data);
        }
    }


}