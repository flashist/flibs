import { ILoadItemConfig } from "./ILoadItemConfig";
export declare class DefaultLoadItemConfig implements Partial<ILoadItemConfig> {
    static DEFAULT_LOADER_ID: string;
    static DEFAULT_LOAD_WEIGHT: number;
    static DEFAULT_LOAD_GROUP: string;
    loader: string;
    loadWeight: number;
    constructor();
    static defaultLoadItem: DefaultLoadItemConfig;
    static addDefaultData(item: ILoadItemConfig): void;
}
