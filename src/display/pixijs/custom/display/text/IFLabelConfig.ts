
import { VAlign } from "../../../../../other/align/VAlign";
import { AutosizeType } from "./AutosizeType";
import { FLabelTextType } from "./FLabelTextType";
import { TextStyle } from "./TextStyle";
import { StrokeInput } from "./StrokeInput";

export interface IFLabelConfig {
    textType?: FLabelTextType;

    bgColor?: number;
    bgAlpha?: number;
    bgStrokeStyle?: StrokeInput;
    bgCornerRadius?: number;

    autosize?: boolean;
    autosizeType?: AutosizeType;
    // maxAutoSize?: Point;
    maxAutosizeWidth?: number;
    maxAutosizeHeight?: number;

    fitToSize?: boolean;
    // THIS PARAMETER IS REQUIRED IF FIT-TO-SIZE IS CHANGING FONT SIZE (not scaling the field)
    changeFontSizeToFitStartSize?: number;
    changeFontSizeToFit?: boolean;
    changeFontSizeStepChange?: number;

    // fieldPadding?: Point;
    fieldPaddingX?: number;
    fieldPaddingY?: number;

    maskToFieldShiftWidth?: number;
    maskToFieldShiftHeight?: number;

    valign?: VAlign;

    nativeTextStyle?: Partial<TextStyle>;

    // fontFamily?: string;
    // size?: number;
    // lineHeight?: number;
    // color?: number;
    // align?: Align;

    // // bold?: boolean;
    // fontWeight?: number | string;

    // wordWrap?: boolean;
    // wordWrapWidth?: number;

    // dropShadow?: TextDropShadow;
    // stroke?: StrokeInput;
}