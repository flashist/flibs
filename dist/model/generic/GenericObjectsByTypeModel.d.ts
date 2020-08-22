import { AssociativeArray } from "fcore";
import { GenericObjectsModel } from "./GenericObjectsModel";
import { IGenericObjectVO } from "./IGenericObjectVO";
export declare class GenericObjectsByTypeModel {
    protected modelsToTypeMap: AssociativeArray<GenericObjectsModel>;
    commitItems(items: IGenericObjectVO[]): void;
    protected getModelForType(type: string): GenericObjectsModel;
    getItem<ItemType extends IGenericObjectVO = IGenericObjectVO>(type: string, id: string): ItemType;
    getItemsForType<ItemType extends IGenericObjectVO = IGenericObjectVO>(type: string): ItemType[];
    mapModelToType(model: GenericObjectsModel, type: string): void;
}
