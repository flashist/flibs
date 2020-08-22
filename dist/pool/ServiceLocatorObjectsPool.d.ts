import { ObjectsPool, IConstructor } from "fcore";
export declare class ServiceLocatorObjectsPool extends ObjectsPool {
    protected createNewObject<T>(ObjectClass: IConstructor<T>, ...args: any[]): T;
}
