import * as WebFont from "webfontloader";

import { AbstractLoadItem } from "../../abstract/item/AbstractLoadItem";
import { IFontLoadItemConfig } from "../../abstract/item/IFontLoadItemConfig";

export class FontLoadItem<DataType extends any = any> extends AbstractLoadItem<DataType> {

    public config: IFontLoadItemConfig;

    protected fontLoadingConfig: WebFont.Config;

    protected internalPrepare(): void {

        super.internalPrepare();

        // Applying CSS to HTML
        let style: any = document.createElement("style");
        style.type = "text/css";
        document.getElementsByTagName('head')[0].appendChild(style);
        let fontRule: string = this.generateFontFaceRule();
        style.sheet.insertRule(fontRule);

        this.fontLoadingConfig = {
            custom: {
                families: [this.config.fontFace["font-family"]]
            },
            timeout: (this.config.timeout || 10000)
        };
    }

    protected internalStart(): void {
        super.internalStart();

        WebFont.load(this.fontLoadingConfig);
    }

    protected internalStop(): void {
        super.internalStop();

        // TODO: find a way to stop font loading, not sure it's possible, for now could be ignored
    }

    protected addLoadingListeners(): void {
        super.addLoadingListeners();
        
        this.fontLoadingConfig.fontloading = (familyName: string, fontValidationDescription: string) => {
            console.log("FontLoadItem | fontloading __ familyName: ", familyName);
        };
        this.fontLoadingConfig.fontactive = (familyName: string, fontValidationDescription: string) => {
            console.log("FontLoadItem | fontactive __ familyName: ", familyName);
            /*setTimeout(
                () => {
                    this.processLoadingComplete(familyName);
                },
                5000
            );*/
            this.processLoadingComplete(familyName, familyName);
        };
        this.fontLoadingConfig.fontinactive = (familyName: string, fontValidationDescription: string) => {
            console.log("FontLoadItem | fontinactive __ familyName: ", familyName);
            this.processLoadingError(
                {
                    data: familyName
                }
            );
        };
    }

    protected generateFontFaceRule(): string {

        let filepathWithoutExtension: string = this.config.src;
        let lastDotIndex: number = filepathWithoutExtension.lastIndexOf('.');
        if (lastDotIndex >= 0) {
            filepathWithoutExtension = filepathWithoutExtension.substring(0, lastDotIndex);
        }

        let result: string = `@font-face {
            src: url('${filepathWithoutExtension}.eot');
            src: url('${filepathWithoutExtension}.woff2') format('woff2'),
                url('${filepathWithoutExtension}.woff') format('woff'),
                url('${filepathWithoutExtension}.ttf') format('truetype'),
                url('${filepathWithoutExtension}.svg#Rochester-Regular') format('svg'),
                url('${filepathWithoutExtension}.eot?#iefix') format('embedded-opentype');`;

        for (let propName in this.config.fontFace) {
            if (propName == "font-family") {
                result += `${propName}: "${this.config.fontFace[propName]}";`;

            } else {
                result += `${propName}: ${this.config.fontFace[propName]};`;
            }
        }

        result += "}";

        return result;
    }
}