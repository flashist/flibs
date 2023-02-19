import {Command} from "@flashist/fcore";
import {getInstance, LoadGroup, LoadManager, LoadStatus, LoadStatusEvent} from "../../../index";

export class WaitGroupLoadingCompleteCommand extends Command {

    constructor(protected groupName: string) {
        super();
    }

    protected executeInternal(): void {
        let loadManager: LoadManager = getInstance(LoadManager);

        let tempGroup: LoadGroup = loadManager.getGroup(this.groupName);
        if (tempGroup.status === LoadStatus.COMPLETE) {
            this.notifyComplete();

        } else if (tempGroup.status === LoadStatus.WAIT && tempGroup.getAllItems().length <= 0) {
            console.log("WaitGroupLoadingCompleteCommand | executeInternal __ Group is not in the loading status! this.groupName: ", this.groupName, " | tempGroup.status: ", tempGroup.status);
            this.notifyComplete();

        } else {
            this.eventListenerHelper.addEventListener(
                tempGroup,
                LoadStatusEvent.STATUS_CHANGE,
                () => {
                    if (tempGroup.status === LoadStatus.COMPLETE) {
                        this.notifyComplete();
                    }
                }
            );
        }
    }

}