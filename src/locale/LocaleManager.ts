﻿import {ObjectTools, StringTools} from "@flashist/fcore";
import {getInstance} from "../servicelocator/ServiceLocatorShortcuts";

import {ILocaleConfig} from "./ILocaleConfig";

export class LocaleManager {

    protected localeToIdMap: any;

    private _currentLocale: string;
    protected currentLocale: ILocaleConfig;

    public useTextLinks: boolean = true;

    protected bindMethodReplaceRegExpKeyByStrings: (substring: string, ...params) => string;

    public constructor() {
        this.localeToIdMap = {};
        this.bindMethodReplaceRegExpKeyByStrings = this.replaceRegExpKeyByStrings.bind(this);

        this.setCurrentLocale("");
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


    public getCurrentLocale(): string {
        return this._currentLocale;
    }

    public setCurrentLocale(value: string) {
        if (value == this._currentLocale) {
            return;
        }

        this._currentLocale = value;

        this.commitLocaleData();
    }


    protected commitLocaleData(): void {
        this.currentLocale = this.localeToIdMap[this._currentLocale];
    }


    public getText(textId: string, params: any = null): string {
        // The text id will be used in the case of no text found
        let result: string = textId;
        if (this.currentLocale) {
            const pathsToText: string[] = textId.split(".");

            let curPathLevel: any = this.currentLocale.texts;
            const pathsCount: number = pathsToText.length;
            for (let pathIndex: number = 0; pathIndex < pathsCount; pathIndex++) {
                const tempPathId: string = pathsToText[pathIndex];
                if (curPathLevel[tempPathId]) {
                    curPathLevel = curPathLevel[tempPathId];
                    // If it's the final path
                    if (pathIndex === pathsCount - 1) {
                        result = curPathLevel;
                        result = this.format(result, params);
                    }
                }
            }

            // if (this.currentLocale.texts[textId]) {
            //     result = this.currentLocale.texts[textId];
            //     result = this.format(result, params);
            // }
        }

        return result;
    }

    protected format(str: string, params: any = null): string {
        var res: string = str;

        if (this.useTextLinks) {
            // Change links by key L on the specific locales
            res = res.replace(/@([^@]+)@/gi, this.bindMethodReplaceRegExpKeyByStrings);
        }

        //
        if (str && params) {
            res = StringTools.substitute(res, params);
        }

        if (this.useTextLinks) {
            // Check the links with L again
            res = res.replace(/@([^@]+)@/gi, this.bindMethodReplaceRegExpKeyByStrings);
        }

        return res;
    }

    protected replaceRegExpKeyByStrings(substring: string, group1: string, ...args): string {
        // return this.currentLocale.texts[group1];
        return this.getText(group1);
    }

    public findAllUniqueCharactersForCurrentLocale(): string[] {
        const allTexts: string[] = [];
        this.getAllTextsOf(this.currentLocale.texts, allTexts);

        let usedCharactersMap: Record<string, boolean> = {};
        let result: string[] = [];
        for (let singleText of allTexts) {
            const singleCharsList: string[] = Array.from(singleText);
            for (let singleChar of singleCharsList) {
                if (!usedCharactersMap[singleChar]) {
                    usedCharactersMap[singleChar] = true;

                    result.push(singleChar);
                }
            }
        }

        return result;
    }

    protected getAllTextsOf(textNode: any, result: string[]): void {
        for (let singleKey in textNode) {
            let childNode: any = textNode[singleKey];
            if (ObjectTools.isObject(childNode)) {
                this.getAllTextsOf(childNode, result);

            } else {
                result.push(childNode);
            }
        }
    }

}

export function getText(textId: string, params: any = null): string {
    return (getInstance(LocaleManager) as LocaleManager).getText(textId, params);
};