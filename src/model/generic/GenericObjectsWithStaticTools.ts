import {IGenericObjectVO} from "./IGenericObjectVO";
import {IGenericObjectWithStaticVO} from "./IGenericObjectWithStaticVO";
import {GenericObjectsByTypeModel} from "./GenericObjectsByTypeModel";
import {getInstance} from "../..";

export class GenericObjectsWithStaticTools {
    static getStaticObject<StaticType extends IGenericObjectVO = IGenericObjectVO>(object: IGenericObjectWithStaticVO): StaticType {
        let result: StaticType;

        if (object.staticType) {
            let staticId: string = object.staticId;
            if (!staticId) {
                staticId = object.id;
            }

            const genericByTypeModel: GenericObjectsByTypeModel = getInstance(GenericObjectsByTypeModel);
            result = genericByTypeModel.getItem(object.staticType, staticId);
        }

        return result;
    }
}