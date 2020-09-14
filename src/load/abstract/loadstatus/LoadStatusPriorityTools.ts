import {LoadStatus} from "./LoadStatus";
import {LoadStatusPriority} from "./LoadStatusPriority";

export class LoadStatusPriorityTools {

    static getTopPriorityStatus(statuses: LoadStatus[]): LoadStatus {
        let result: LoadStatus;

        let lastLoadStatusPriority: number;
        for (let singleStatus of statuses) {
            const statusPriority: number = LoadStatusPriority[singleStatus];

            if ((!result) ||
                (statusPriority > lastLoadStatusPriority)) {

                result = singleStatus;
                lastLoadStatusPriority = statusPriority;
            }

            // If any of status is an ERROR status, stop checking, as it's the top possible priority status
            if (result === LoadStatus.ERROR) {
                break;
            }
        }

        return result;
    }
}