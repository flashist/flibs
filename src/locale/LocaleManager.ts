import {
    StringTools
} from "@flashist/fcore";

import {
    ILocaleConfig
} from "./ILocaleConfig";

import {getInstance} from "../servicelocator/ServiceLocator";

export class LocaleManager {

    protected localeToIdMap: any;

    private _currentLanguage: string;
    protected currentLocale: ILocaleConfig;

    public useTextLinks: boolean = true;

    protected bindMethodReplaceRegExpKeyByStrings: (substring: string, ...params) => string;

    public constructor() {
        this.localeToIdMap = {};
        this.bindMethodReplaceRegExpKeyByStrings = this.replaceRegExpKeyByStrings.bind(this);

        this.setCurrentLanguage("");
    }

    public addLocale(data: ILocaleConfig, localeId: string): void {
        // Support adding texts to the old localization
        let oldLocale: ILocaleConfig = {
            texts: {}
        };
        if (this.localeToIdMap[localeId]) {
            oldLocale = this.localeToIdMap[localeId];
        }

        // ObjectTools.copyProps(oldLocale.texts, data.texts);
        (Object as any).assign(
            oldLocale.texts,
            data.texts
        );

        this.localeToIdMap[localeId] = oldLocale;

        this.commitLocaleData();
    }


    public getCurrentLanguage(): string {
        return this._currentLanguage;
    }

    public setCurrentLanguage(value: string) {
        if (value == this._currentLanguage) {
            return;
        }

        this._currentLanguage = value;

        this.commitLocaleData();
    }


    protected commitLocaleData(): void {
        this.currentLocale = this.localeToIdMap[this._currentLanguage];
    }


    public getText(textId: string, params: any = null): string {
        var result: string = "";
        if (this.currentLocale) {
            if (this.currentLocale.texts[textId]) {
                result = this.currentLocale.texts[textId];
                result = this.format(result, params);
            }
        }

        return result;
    }

    protected format(str: string, params: any = null): string {
        var res: string = str;

        if (this.useTextLinks) {
            // Change links by key L on the specific locales
            res = res.replace(/\@(.*)\@/gi, this.bindMethodReplaceRegExpKeyByStrings);
        }

        //
        if (str && params) {
            res = StringTools.substitute(res, params);
        }

        if (this.useTextLinks) {
            // Check the links with L again
            res = res.replace(/\@(.*)\@/gi, this.bindMethodReplaceRegExpKeyByStrings);
        }

        return res;
    }

    protected replaceRegExpKeyByStrings(substring: string, group1: string, ...args): string {
        return this.currentLocale.texts[group1];
    }
}

export function getText(textId: string, params: any = null): string {
    return (getInstance(LocaleManager) as LocaleManager).getText(textId, params);
};