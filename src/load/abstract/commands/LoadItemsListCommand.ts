import {Command, CommandErrorCode} from "@flashist/fcore";
import {
    AbstractLoadItem,
    ILoadItemConfig,
    LoadItemCommand
} from "../../..";

export class LoadItemsListCommand extends Command {

    public loadItem: AbstractLoadItem;

    constructor(protected items: ILoadItemConfig[]) {
        super();
    }

    protected executeInternal(): void {

        let waitPromisses: Promise<any>[] = [];
        for (let singleLoadItem of this.items) {
            let tempCmd: LoadItemCommand = new LoadItemCommand(singleLoadItem);
            let tempPromise: Promise<any> = tempCmd.execute();
            waitPromisses.push(tempPromise);
        }

        Promise.all(waitPromisses)
            .then(
                () => {
                    this.notifyComplete();
                },
                () => {
                    this.errorCode = CommandErrorCode.GENERAL_ERROR;
                    this.terminate();
                }
            );
    }

}