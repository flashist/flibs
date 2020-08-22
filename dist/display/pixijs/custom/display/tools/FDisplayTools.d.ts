import { DisplayObject, FStage, IFDisplayObjectUnderPointVO } from "../../../../../index";
export declare class FDisplayTools {
    static findStageInDisplayList(object: DisplayObject): FStage;
    private static cachedPoint;
    static getObjectsUnderPoint(root: DisplayObject, x: number, y: number): IFDisplayObjectUnderPointVO;
}
