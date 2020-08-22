import {ILoadItemConfig} from "../abstract/item/ILoadItemConfig";

export class LoadTools {
    public static getUniqueLoadingId(config: ILoadItemConfig): string {
        return config.src + "_" + config.uniqueId;
    }
}