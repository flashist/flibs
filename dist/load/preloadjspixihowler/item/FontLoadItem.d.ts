import * as WebFont from "webfontloader";
import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
import { IFontLoadItemConfig } from "../../abstract/item/IFontLoadItemConfig";
export declare class FontLoadItem extends AbstractLoadItem {
    config: IFontLoadItemConfig;
    protected fontLoadingConfig: WebFont.Config;
    protected internalPrepare(): void;
    protected internalStart(): void;
    protected internalStop(): void;
    protected addLoadingListeners(): void;
    protected generateFontFaceRule(): string;
}
