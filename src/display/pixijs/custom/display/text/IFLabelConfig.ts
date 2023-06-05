
import { Align } from "../../../../../other/align/Align";
import { VAlign } from "../../../../../other/align/VAlign";
import { AutosizeType } from "./AutosizeType";
import { FLabelTextType } from "./FLabelTextType";
import { GradientColorType } from "./GradientColorType";

export interface IFLabelConfig {
    textType?: FLabelTextType;
    bgColor?: number;
    bgAlpha?: number;
    autosize?: boolean;
    autosizeType?: AutosizeType;
    // maxAutoSize?: Point;
    maxAutosizeWidth?: number;
    maxAutosizeHeight?: number;
    fitToSize?: boolean;
    changeFontSizeToFit?: boolean;
    changeFontSizeStepChange?: number;
    // fieldPadding?: Point;
    fieldPaddingX?: number;
    fieldPaddingY?: number;

    fontFamily?: string;
    size?: number;
    lineHeight?: number;
    lineJoin?: string;
    miterLimit?: number;
    color?: number;
    gradientColor?: {
        colors: number[];
        stops: number[];
        type: GradientColorType
    };
    align?: Align;
    valign?: VAlign;
    bold?: boolean;

    wordWrap?: boolean;
    wordWrapWidth?: number;

    dropShadow?: boolean;
    dropShadowColor?: number;
    dropShadowAlpha?: number;
    dropShadowDistance?: number;
    dropShadowAngle?: number;
    dropShadowBlur?: number;


    stroke?: number;
    strokeThickness?: number;
}