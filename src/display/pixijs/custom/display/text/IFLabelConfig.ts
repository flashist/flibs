
import { Align } from "../../../../../other/align/Align";
import { VAlign } from "../../../../../other/align/VAlign";
import { AutosizeType } from "./AutosizeType";

export interface IFLabelConfig {
    isBitmap?: boolean;
    bgColor?: number;
    bgAlpha?: number;
    autosize?: boolean;
    autosizeType?: AutosizeType;
    // maxAutoSize?: Point;
    maxAutosizeWidth?: number;
    maxAutosizeHeight?: number;
    fitToSize?: boolean;
    // fieldPadding?: Point;
    fieldPaddingX?: number;
    fieldPaddingY?: number;

    fontFamily?: string;
    size?: number;
    color?: number;
    align?: Align;
    valign?: VAlign;
    bold?: boolean;

    dropShadow?: boolean;
    dropShadowColor?: number;
    dropShadowAlpha?: number;
    dropShadowDistance?: number;
    dropShadowAngle?: number;
    dropShadowBlur?: number;


    stroke?: number;
    strokeThickness?: number;
}