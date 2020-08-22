import { IConstructor } from "@flashist/fcore";
import { ICreateConfig, IServiceLocatorOptions } from "../index";
export declare class ServiceLocator {
    static options: IServiceLocatorOptions;
    private static injectionsMap;
    private static activatorToActivateesMap;
    static activate(): void;
    static add(item: IConstructor, config?: ICreateConfig): void;
    static getInstance<Type extends any>(item: IConstructor<Type>, ...args: any[]): Type;
    private static getInjection;
    static processItemOnActivate(item: any): void;
    static processItemOnDeactivate(item: any): void;
    private static getChainActivateesConstructors;
    private static getConstructorName;
}
export declare const getInstance: typeof ServiceLocator.getInstance;
export declare const serviceLocatorAdd: typeof ServiceLocator.add;
export declare const serviceLocatorProcessItemOnActivate: typeof ServiceLocator.processItemOnActivate;
export declare const serviceLocatorProcessItemOnDeactivate: typeof ServiceLocator.processItemOnDeactivate;
