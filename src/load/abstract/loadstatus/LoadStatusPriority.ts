import {LoadStatus} from "./LoadStatus";

export const LoadStatusPriority = ((): {[key: string]: number} => {
    const result: {[key: string]: number} = {};

    result[LoadStatus.ERROR] = 0;
    result[LoadStatus.WAIT] = 1;
    result[LoadStatus.LOADING] = 2;
    result[LoadStatus.COMPLETE] = 3;

    return result;
})();