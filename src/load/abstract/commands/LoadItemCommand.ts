import {Command, CommandErrorCode} from "@flashist/fcore";
import {AbstractLoadItem, getInstance, ILoadItemConfig, LoadManager, LoadStatus, LoadStatusEvent} from "../../..";

export class LoadItemCommand extends Command {

    public loadItem: AbstractLoadItem;

    constructor(protected loadConfig: ILoadItemConfig) {
        super();
    }

    protected executeInternal(): void {
        let loadManager: LoadManager = getInstance(LoadManager);

        this.loadItem = loadManager.load(this.loadConfig);
        this.eventListenerHelper.addEventListener(
            this.loadItem,
            LoadStatusEvent.STATUS_CHANGE,
            () => {
                this.processFinalStatus();
            }
        );

        this.processFinalStatus();
    }

    protected processFinalStatus(): void {
        if (this.loadItem.status === LoadStatus.COMPLETE) {
            this.processComplete();
        } else if (this.loadItem.status === LoadStatus.ERROR) {
            this.processError();
        }
    }

    protected processComplete(): void {
        this.notifyComplete(this.loadItem.data);
    }

    protected processError(): void {
        this.errorCode = CommandErrorCode.GENERAL_ERROR;
        this.terminate();
    }

}