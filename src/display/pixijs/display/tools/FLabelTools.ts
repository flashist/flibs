import { Logger } from "@flashist/fcore";

import {
    TextTruncateType,
    Text,
    FLabel
} from "../../../../index";

export class FLabelTools {
    static changeFontSizeToFit(
        field: FLabel,
        config?: {
            maxWidth?: number,
            maxHeight?: number,
            stepChange?: number,
            maxStepsCount?: number
        }
    ): void {

        if (!config) {
            config = {}
        }

        if (!config.maxWidth || field.width <= config.maxWidth) {
            config.maxWidth = field.width;
        }
        if (!config.maxHeight || field.height <= config.maxHeight) {
            config.maxHeight = field.height;
        }
        if (!field.text || (field.textWidth <= config.maxWidth && field.textHeight <= config.maxHeight)) {
            return;
        }
        // if (field.isBitmap) {
        //     console.log("WARNING! FLabelTools | changeFontSizeToFit __ BITMAP FIELDS ARE NOT SUPPORTED YET!")
        //     return;
        // }

        const maxSteps: number = config.maxStepsCount || 100;
        const stepChange: number = config.stepChange || -1;

        let step: number = 0;
        while (field.size > 0 && ((field.textWidth > config.maxWidth) || (field.textHeight > config.maxHeight))) {
            field.size += stepChange;

            // Preventing code from "stucking"
            step++;
            if (step >= maxSteps) {
                Logger.error("FLabelTools | changeFontSizeToFit __ ERROR! Max steps count!");
                break;
            }
        }
    };

    static truncateToFit(field: FLabel,
        maxWidth?: number,
        maxHeight?: number,
        truncateType: TextTruncateType = TextTruncateType.FROM_RIGHT,
        afterTruncateText: string = "..."): boolean {

        if (!maxWidth || field.width <= maxWidth) {
            maxWidth = field.width;
        }
        if (!maxHeight || field.height <= maxHeight) {
            maxHeight = field.height;
        }
        if (!field.text || (field.textWidth <= maxWidth && field.textHeight <= maxHeight)) {
            return false;
        }

        var text = field.text;
        var cached = text;
        var maxSteps = 1000;
        var step = 0;
        while (text.length > 0 &&
            ((field.textWidth > maxWidth) || (field.textHeight > maxHeight))) {
            if (truncateType === TextTruncateType.FROM_LEFT) {
                text = text.substring(1, text.length);
                field.text = afterTruncateText + text;
            } else {
                text = text.substring(0, text.length - 1);
                field.text = text + afterTruncateText;
            }
            // Preventing code from "stucking"
            step++;
            if (step >= maxSteps) {
                Logger.error("FLabelTools | truncateToFit __ ERROR! Max steps count!");
                break;
            }
        }

        return text !== cached;
    };
}