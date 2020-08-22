import { Command } from "fcore";
export declare class WaitGroupLoadingCompleteCommand extends Command {
    protected groupName: string;
    constructor(groupName: string);
    protected executeInternal(): void;
}
