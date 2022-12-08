import { AbstractLoadFactory } from "../abstract/AbstractLoadFactory";
import { FileLoadItem } from "./item/FileLoadItem";
import { FileType } from "../abstract/data/FileType";
import { PixiImageLoadItem } from "./item/PixiImageLoadItem";
import { FontLoadItem } from "./item/FontLoadItem";
import { HowlerSoundLoadItem } from "./item/HowlerSoundLoadItem";
import { PixiSpineLoadItem } from "./item/PixiSpineLoadItem";

export class PreloadjsPixiLoadFactory extends AbstractLoadFactory {
    constructor() {
        super();

        this.fileTypeToLoadItemClassMap[FileType.DEFAULT] = FileLoadItem;
        this.fileTypeToLoadItemClassMap[FileType.FONT] = FontLoadItem;
        this.fileTypeToLoadItemClassMap[FileType.SOUND] = HowlerSoundLoadItem;
        this.fileTypeToLoadItemClassMap[FileType.IMAGE] = PixiImageLoadItem;
        this.fileTypeToLoadItemClassMap[FileType.SPRITESHEET] = PixiImageLoadItem;
        this.fileTypeToLoadItemClassMap[FileType.SPINE] = PixiSpineLoadItem;
    }

    // protected internalCreateItem(config: ILoadItemConfig): AbstractLoadItem {
    //     let result: AbstractLoadItem;

    //     switch (config.fileType) {
    //         case FileType.IMAGE:
    //         case FileType.SPRITESHEET:
    //             result = new PixiImageLoadItem(config);
    //             break;
    //         case FileType.FONT:
    //             result = new FontLoadItem(config);
    //             break;
    //         case FileType.SOUND:
    //             result = new HowlerSoundLoadItem(config);
    //             break;
    //         default:
    //             result = new FileLoadItem(config);
    //     }

    //     return result;
    // }

}