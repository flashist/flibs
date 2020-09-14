import {LoadStatus} from "./LoadStatus";

export const LoadStatusPriority = ((): {[key: string]: number} => {
    const result: {[key: string]: number} = {};

    result[LoadStatus.ERROR] = 1000;
    result[LoadStatus.LOADING] = 100;
    result[LoadStatus.WAIT] = 10;
    result[LoadStatus.COMPLETE] = 0;

    return result;
})();