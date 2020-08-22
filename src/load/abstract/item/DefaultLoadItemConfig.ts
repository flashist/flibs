import {ObjectTools} from "@flashist/fcore";

import {ILoadItemConfig} from "./ILoadItemConfig";

export class DefaultLoadItemConfig implements Partial<ILoadItemConfig> {

    static DEFAULT_LOADER_ID: string = "default";
    static DEFAULT_LOAD_WEIGHT: number = 1;
    static DEFAULT_LOAD_GROUP: string = "default";

    public loader: string;
    public loadWeight: number;

    constructor() {
        this.loader = DefaultLoadItemConfig.DEFAULT_LOADER_ID;
        this.loadWeight = DefaultLoadItemConfig.DEFAULT_LOAD_WEIGHT;
    }

    static defaultLoadItem: DefaultLoadItemConfig = new DefaultLoadItemConfig();
    static addDefaultData(item: ILoadItemConfig): void {
        ObjectTools.copyProps(
            item,
            DefaultLoadItemConfig.defaultLoadItem,
            {
                ignoreExistedProperties: true
            }
        );

        // Default load groups
        if (!item.loadGroups) {
            item.loadGroups = [];
        }
        if (item.loadGroups) {
            item.loadGroups.push(DefaultLoadItemConfig.DEFAULT_LOAD_GROUP);
        }
    }
}