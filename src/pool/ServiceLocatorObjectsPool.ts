import {ObjectsPool, IConstructor} from "@flashist/fcore";
import {getInstance} from "../index";

export class ServiceLocatorObjectsPool extends ObjectsPool {

    protected createNewObject<T>(ObjectClass: IConstructor<T>, ...args): T {
        return getInstance(ObjectClass);
    }
}