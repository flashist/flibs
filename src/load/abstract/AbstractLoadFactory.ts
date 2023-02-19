import {ILoadItemConfig} from "./item/ILoadItemConfig";
import {AbstractLoadItem} from "./item/AbstractLoadItem";
import {IConstructor} from "@flashist/fcore";
import {FileType} from "./data/FileType";
import {getInstance, LoadManager} from "../../index";

export abstract class AbstractLoadFactory {
    static instance: AbstractLoadFactory;

    fileTypeToLoadItemClassMap: { [fileType: string]: IConstructor<AbstractLoadItem> };
    basePath: string;

    constructor() {
        this.fileTypeToLoadItemClassMap = {};
    }

    public createItem(config: ILoadItemConfig): AbstractLoadItem {
        this.prepareConfig(config);

        return this.internalCreateItem(config);
    }

    protected internalCreateItem(config: ILoadItemConfig): AbstractLoadItem {
        let TempClass: IConstructor<AbstractLoadItem> = this.fileTypeToLoadItemClassMap[config.fileType];
        if (!TempClass) {
            TempClass = this.fileTypeToLoadItemClassMap[FileType.DEFAULT];
        }

        const result: AbstractLoadItem = new TempClass(config);
        return result;
    }

    protected prepareConfig(config: ILoadItemConfig): void {

        if (!config.basePath) {
            if (this.basePath) {
                config.basePath = this.basePath;
            }
        }

        const loadManager: LoadManager = getInstance(LoadManager);
        if (config.basePath) {
            config.basePath = loadManager.substituteUrlPlaceholders(config.basePath);
        }
        if (config.src) {
            config.src = loadManager.substituteUrlPlaceholders(config.src);
        }
    }

}