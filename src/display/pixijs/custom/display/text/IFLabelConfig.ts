
import { AutosizeType } from "./AutosizeType";
import { Point } from "../../../../..";

export interface IFLabelConfig {
    isBitmap?: boolean;
    bgColor?: number;
    bgAlpha?: number;
    autosize?: boolean;
    autosizeType?: AutosizeType;
    maxAutoSize?: Point;
    fitToSize?: boolean;
    fieldPadding?: Point;

    fontFamily?: string;
    size?: number;
    color?: number;
    align?: string;
    valign?: string;
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