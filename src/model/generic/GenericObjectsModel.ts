import {AssociativeArray, BaseObject, IConstructor} from "fcore";
import {BaseDataVO} from "../..";

import {IGenericObjectVO} from "./IGenericObjectVO";
import {GenericObjectChangeActionType} from "./GenericObjectChangeActionType";

export class GenericObjectsModel<ItemType extends IGenericObjectVO = IGenericObjectVO> extends BaseObject {

    protected items: AssociativeArray<ItemType> = new AssociativeArray<ItemType>();
    public itemsType: string;
    public DefaultItemClass: IConstructor<ItemType>;

    protected construction(...args): void {
        super.construction(...args);

        this.DefaultItemClass = BaseDataVO as any;
    }

    public parseSource(source: IGenericObjectVO): void {
        switch (source.action) {
            case GenericObjectChangeActionType.REMOVE:
                this.removeItem(source.id);
                break;

            //case ChangeActionType.UPDATE:
            default:
                this.updateItem(this.getItem(source.id), source);
                break;
        }
    }

    public getItem(id: string, isNeedToCreate: boolean = true): ItemType {
        let result = this.items.getItem(id);

        if (!result) {
            if (isNeedToCreate) {
                result = this.createEmpty(id);
                this.items.push(result, result.id);
            }
        }

        return result;
    }

    protected removeItem(id: string): void {
        this.items.removeByKey(id);
    }

    public get itemsCount(): number {
        return this.items.length;
    }

    protected createEmpty(id: string): ItemType {
        let result: ItemType;

        const initSourceData: any = {id: id, type: this.itemsType};
        if (this.DefaultItemClass) {
            result = new this.DefaultItemClass();
        } else {
            result = initSourceData;
        }

        this.updateItem(result, initSourceData);

        return result;
    }

    protected updateItem(item: ItemType, source: any): void {
        if (item.update) {
            item.update(source);
        } else {
            (Object as any).assign(item, source);
        }
    }

    public getAllItems(): ItemType[] {
        return this.items.getAllItems();
    }
}