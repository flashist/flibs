import {ILoadItemConfig} from "./ILoadItemConfig";

export interface IFontLoadItemConfig extends ILoadItemConfig {
    fontFace: {
        "font-family": string;
        "font-weight"?: string;
        "font-style"?: string;
    };
    timeout?: number;
}