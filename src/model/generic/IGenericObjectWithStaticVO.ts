import {IGenericObjectVO} from "./IGenericObjectVO";

export interface IGenericObjectWithStaticVO<StaticDataType extends IGenericObjectVO = IGenericObjectVO>
    extends IGenericObjectVO {

    staticId?: string;
    staticType?: string;
    staticData?: StaticDataType;
}