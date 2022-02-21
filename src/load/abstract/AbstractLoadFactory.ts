import {ILoadItemConfig} from "./item/ILoadItemConfig";
import {AbstractLoadItem} from "./item/AbstractLoadItem";
import {getInstance, LoadManager} from "../../index";

export abstract class AbstractLoadFactory {
    static instance: AbstractLoadFactory;

    basePath: string;

    public createItem(config: ILoadItemConfig): AbstractLoadItem {
        this.prepareConfig(config);

        return this.internalCreateItem(config);
    }

    protected abstract internalCreateItem(config: ILoadItemConfig): AbstractLoadItem;

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