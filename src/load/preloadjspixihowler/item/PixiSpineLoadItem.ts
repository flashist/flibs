import { FileLoadItem } from "./FileLoadItem";

export class PixiSpineLoadItem<DataType extends any = any> extends FileLoadItem<DataType> {

    protected onLoaderComplete(resourcesMap: { [key: string]: any }): void {
        // Don't call super, because parsing of spine animations should be a bit different
        var tempFileItem = resourcesMap[this.config.id];
        this.processLoadingComplete(tempFileItem, tempFileItem.spineData);
    }
    
}