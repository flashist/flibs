import { Align } from "../../../../../index";

export enum FLabelNativeStyleFontWeight {
    NORMAL = 'normal',
    BOLD = 'bold',

    BOLDER = 'bolder',
    LIGHTER = 'lighter',

    WEIGHT_100 = '100',
    WEIGHT_200 = '200',
    WEIGHT_300 = '300',
    WEIGHT_400 = '400',
    WEIGHT_500 = '500',
    WEIGHT_600 = '600',
    WEIGHT_700 = '700',
    WEIGHT_800 = '800',
    WEIGHT_900 = '900',

    THIN = WEIGHT_100,
    EXTRA_LIGHT = WEIGHT_200,
    LIGHT = WEIGHT_300,
    REGULAR = WEIGHT_400,
    MEDIUM = WEIGHT_500,
    SEMI_BOLD = WEIGHT_600,
    EXTRA_BOLD = WEIGHT_800,
    BLACK = WEIGHT_900,
};

export enum FLabelNativeStyleAlign {
    LEFT = Align.LEFT,
    RIGHT = Align.RIGHT,
    CENTER = Align.CENTER,
    JUSTIFY = 'jistify'
};