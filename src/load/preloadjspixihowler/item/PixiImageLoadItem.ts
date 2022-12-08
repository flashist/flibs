import { FileLoadItem } from "./FileLoadItem";

export class PixiImageLoadItem<DataType extends any = any> extends FileLoadItem<DataType> {

    protected onLoaderComplete(resourcesMap: { [key: string]: any }): void {
        // Don't call super, because parsing of images should be a bit different
        this.processLoadingComplete(resourcesMap, resourcesMap);
    }

}