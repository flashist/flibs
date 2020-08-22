import { Command } from "fcore";
import { AbstractLoadItem, ILoadItemConfig } from "../../..";
export declare class LoadItemCommand extends Command {
    protected loadConfig: ILoadItemConfig;
    loadItem: AbstractLoadItem;
    constructor(loadConfig: ILoadItemConfig);
    protected executeInternal(): void;
    protected processFinalStatus(): void;
    protected processComplete(): void;
    protected processError(): void;
}
