import { IGenericObjectVO } from "./IGenericObjectVO";
import { IGenericObjectWithStaticVO } from "./IGenericObjectWithStaticVO";
export declare class GenericObjectsWithStaticTools {
    static getStaticObject<StaticType extends IGenericObjectVO = IGenericObjectVO>(object: IGenericObjectWithStaticVO): StaticType;
}
