import { DisplayObjectContainer } from "../DisplayObjectContainer";
import { IResizeConfig } from "./IResizeConfig";
export declare class DisplayResizeTools {
    static scaleObject(object: DisplayObjectContainer, width: number, height: number, config?: IResizeConfig): void;
    static getScale(origWidth: number, origHeight: number, targetWidth: number, targetHeight: number, config?: IResizeConfig): number;
}
