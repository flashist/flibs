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
        let fontRule: string = this.generateFontFaceRule();
        style.sheet.insertRule(fontRule);
        //
        document.getElementsByTagName('head')[0].appendChild(style);

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

            // THIS IS MAGIC!
            // We're creating virtually invisible p tag in order to force browsers
            // to prepare the font for later usage
            var el = document.createElement('p');
            el.style.fontFamily = this.config.fontFace["font-family"];
            el.style.fontWeight = this.config.fontFace["font-weight"];
            el.style.fontStyle = this.config.fontFace["font-style"];
            el.style.fontSize = "0px";
            el.style.visibility = "hidden";
            el.innerHTML = '.';
            //
            document.body.appendChild(el);
        };
        this.fontLoadingConfig.fontactive = (familyName: string, fontValidationDescription: string) => {
            console.log("FontLoadItem | fontactive __ familyName: ", familyName);
            // Give browser some time to prepare fonts for using
            setTimeout(
                () => {
                    this.processLoadingComplete(familyName, familyName);
                },
                500
            );
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

        // The text after the last slash is the filename without extension
        let fileNameWithoutExtension: string = filepathWithoutExtension.split("/").pop();

        let result: string = `@font-face {
            src: url('${filepathWithoutExtension}.eot');
            src: url('${filepathWithoutExtension}.woff2') format('woff2'),
                url('${filepathWithoutExtension}.woff') format('woff'),
                url('${filepathWithoutExtension}.ttf') format('truetype'),
                url('${filepathWithoutExtension}.svg#${fileNameWithoutExtension}') format('svg'),
                url('${filepathWithoutExtension}.eot?#iefix') format('embedded-opentype');`;

        for (let propName in this.config.fontFace) {
            if (propName == "font-family") {
                result += `${propName}: "${this.config.fontFace[propName]}";\n`;

            } else {
                result += `${propName}: ${this.config.fontFace[propName]};\n`;
            }
        }

        result += "}";

        return result;
    }
}