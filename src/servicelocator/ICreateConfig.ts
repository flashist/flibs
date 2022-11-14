import { IConstructor } from "@flashist/fcore";
import { IActivatee } from "./IActivatee";

export interface ICreateConfig {
    id?: string;

    toSubstitute?: IConstructor,

    isSingleton?: boolean;
    forceCreation?: boolean;

    activateeConstructors?: IConstructor<IActivatee>[];

    // constructionArgs?: any[];
}