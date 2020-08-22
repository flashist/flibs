import {ObjectTools} from "fcore";

import {DisplayObjectContainer} from "../DisplayObjectContainer";
import {IResizeConfig} from "./IResizeConfig";

export class DisplayResizeTools {

    public static scaleObject(
        object: DisplayObjectContainer,
        width: number,
        height: number,
        config?: IResizeConfig): void {

        let tempScale: number = DisplayResizeTools.getScale(
            object.width,
            object.height,
            width,
            height,
            config
        );
        object.scale.set(tempScale, tempScale);
    }

    public static getScale(
        origWidth: number,
        origHeight: number,
        targetWidth: number,
        targetHeight: number,
        config?: IResizeConfig): number {

        let result: number = 1;

        if (!config) {
            config = {};
        }

        if (targetWidth > 0 && targetHeight > 0) {

            if (config.upscaleAllowed || origWidth > targetWidth || origHeight > targetHeight) {

                const maxDelta: number = targetWidth / targetHeight;
                const objDelta: number = origWidth / origHeight;

                if ((objDelta <= maxDelta && config.scaleByMinSide) || (objDelta > maxDelta && !config.scaleByMinSide)) {
                    /*object.width = width;
                    object.scale.y = object.scale.x;*/
                    result = targetWidth / origWidth;

                } else {
                    /*object.height = height;
                    object.scale.x = object.scale.y;*/
                    result = targetHeight / origHeight;
                }
            }
        }

        return result;
    }
}