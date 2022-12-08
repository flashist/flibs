import { ObjectTools } from "@flashist/fcore";
import { FileType } from "../../abstract/data/FileType";
import { ILoadItemConfig } from "../../abstract/item/ILoadItemConfig";
import { FileLoadItem } from "./FileLoadItem";
import { IPixiSpineLoadItemConfig } from "./IPixiSpineLoadItemConfig";
import { PixiImageLoadItem } from "./PixiImageLoadItem";

export class PixiSpineLoadItem<DataType extends any = any> extends FileLoadItem<DataType> {

    protected onLoaderComplete(resourcesMap: { [key: string]: any }): void {
        // Don't call super, because parsing of images should be a bit different
        // this.processLoadingComplete(resourcesMap, resourcesMap);

        // When the initial item is loaded, start loading the atlas-file attached to the spine animation
        
    }
    
}