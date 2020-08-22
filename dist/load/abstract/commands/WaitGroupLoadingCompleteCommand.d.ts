import { Command } from "@flashist/fcore";
export declare class WaitGroupLoadingCompleteCommand extends Command {
    protected groupName: string;
    constructor(groupName: string);
    protected executeInternal(): void;
}
