import {AbstractLoadItem, ILoadProgressVO, LoadStatus} from "../../..";

export class LoadProgressTool {
    static getProgressForItems(items: AbstractLoadItem[]): ILoadProgressVO {

        let totalWeight: number = 0;
        let loadedWeight: number = 0;

        let tempItemWeight: number;
        for (let singleItem of items) {
            tempItemWeight = singleItem.config.loadWeight;
            if (!tempItemWeight) {
                tempItemWeight = 1;
            }

            totalWeight += tempItemWeight;
            if (singleItem.status === LoadStatus.COMPLETE || singleItem.status === LoadStatus.ERROR) {
                loadedWeight += tempItemWeight;
            }
        }

        const progress: number = loadedWeight / totalWeight;

        const result: ILoadProgressVO = {
            progress: progress,
            loadedWeight: loadedWeight,
            totalWeight: totalWeight
        };
        return result;
    }
}