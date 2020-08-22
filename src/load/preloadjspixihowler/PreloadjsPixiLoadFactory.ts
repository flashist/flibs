import {AbstractLoadFactory} from "../abstract/AbstractLoadFactory";
import {AbstractLoadItem} from "../abstract/item/AbstractLoadItem";
import {ILoadItemConfig} from "../abstract/item/ILoadItemConfig";
import {FileLoadItem} from "./item/FileLoadItem";
import {FileType} from "../abstract/data/FileType";
import {PixiImageLoadItem} from "./item/PixiImageLoadItem";
import {FontLoadItem} from "./item/FontLoadItem";
import {HowlerSoundLoadItem} from "./item/HowlerSoundLoadItem";

export class PreloadjsPixiLoadFactory extends AbstractLoadFactory {

    createItem(config: ILoadItemConfig): AbstractLoadItem {
        // Only FileLoadItem, until other loaders are implemented

        let result: AbstractLoadItem;

        if (this.basePath) {
            config.basePath = this.basePath;
        }

        switch (config.fileType) {
            case FileType.IMAGE:
            case FileType.SPRITESHEET:
                result = new PixiImageLoadItem(config);
                break;
            case FileType.FONT:
                result = new FontLoadItem(config);
                break;
            case FileType.SOUND:
                result = new HowlerSoundLoadItem(config);
                break;
            default:
                result = new FileLoadItem(config);
        }

        return result;
    }

}