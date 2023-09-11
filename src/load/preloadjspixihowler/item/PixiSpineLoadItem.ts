import { FileLoadItem } from "./FileLoadItem";

export class PixiSpineLoadItem<DataType extends any = any> extends FileLoadItem<DataType> {

    // protected onLoaderComplete(resourcesMap: { [key: string]: any }): void {
    //     // Don't call super, because parsing of spine animations should be a bit different
    //     var tempFileItem = resourcesMap[this.config.id];
    //     this.processLoadingComplete(tempFileItem, tempFileItem.spineData);
    // }

    protected processLoadingComplete(sourceData: any, data: any): void {
        // Parsing of spine animations should be a bit different
        super.processLoadingComplete(sourceData, sourceData.spineData);

        // super.processLoadingComplete(sourceData, data);

        // this.sourceData = sourceData;
        // this.data = data;
        // this.status = LoadStatus.COMPLETE;

        // LoadResourcesCache.add(this.config.id, data);

        // this.removeLoadingListeners();

        // this.dispatchEvent(LoadEvent.COMPLETE);
        // this.startPromiseResolve();
    }

}