import { ILocaleConfig } from "./ILocaleConfig";
export declare class LocaleManager {
    protected localeToIdMap: any;
    private _currentLanguage;
    protected currentLocale: ILocaleConfig;
    constructor();
    addLocale(data: ILocaleConfig, localeId: string): void;
    getCurrentLanguage(): string;
    setCurrentLanguage(value: string): void;
    protected commitLocaleData(): void;
    getText(textId: string, params?: any): string;
    protected format(str: string, params?: any): string;
    protected replaceRegExpKeyByStrings(substring: string, ...params: any[]): string;
}
export declare function getText(textId: string, params?: any): string;
