import { AssociativeArray } from "@flashist/fcore";

import { GenericObjectsModel } from "./GenericObjectsModel";
import { IGenericObjectVO } from "./IGenericObjectVO";

export class GenericObjectsByTypeModel {
    protected modelsToTypeMap: AssociativeArray<GenericObjectsModel> = new AssociativeArray<GenericObjectsModel>();

    public commitItems(items: IGenericObjectVO[]): void {
        let tempModel: GenericObjectsModel;
        for (let sourceItem of items) {
            tempModel = this.getModelForType(sourceItem.type);
            tempModel.parseSource(sourceItem);
        }
    }

    protected getModelForType(type: string): GenericObjectsModel {
        let result: GenericObjectsModel = this.modelsToTypeMap.getItem(type);
        if (!result) {
            result = new GenericObjectsModel();
            result.itemsType = type;

            this.mapModelToType(result, type);
        }

        return result;
    }

    public getItem<ItemType extends IGenericObjectVO = IGenericObjectVO>(type: string, id: string): ItemType {
        const typeModel: GenericObjectsModel = this.getModelForType(type);
        return typeModel.getItem(id) as ItemType;
    }

    public getItemsForType<ItemType extends IGenericObjectVO = IGenericObjectVO>(type: string, makeCopy: boolean = true): ItemType[] {
        const typeModel: GenericObjectsModel = this.getModelForType(type);
        return typeModel.getAllItems(makeCopy) as ItemType[];
    }

    public mapModelToType(model: GenericObjectsModel, type: string): void {
        this.modelsToTypeMap.push(model, type);
    }
}