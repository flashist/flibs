import {ILoadItemConfig} from "./item/ILoadItemConfig";
import {AbstractLoadItem} from "./item/AbstractLoadItem";
import {getInstance, LoadManager} from "../../index";

export abstract class AbstractLoadFactory {
    static instance: AbstractLoadFactory;

    protected loadManager: LoadManager = getInstance(LoadManager);

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

        if (config.basePath) {
            config.basePath = this.loadManager.substituteUrlPlaceholders(config.basePath);
        }
        if (config.src) {
            config.src = this.loadManager.substituteUrlPlaceholders(config.src);
        }
    }

}