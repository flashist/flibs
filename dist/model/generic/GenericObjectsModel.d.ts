import { AssociativeArray, BaseObject, IConstructor } from "@flashist/fcore";
import { IGenericObjectVO } from "./IGenericObjectVO";
export declare class GenericObjectsModel<ItemType extends IGenericObjectVO = IGenericObjectVO> extends BaseObject {
    protected items: AssociativeArray<ItemType>;
    itemsType: string;
    DefaultItemClass: IConstructor<ItemType>;
    protected construction(...args: any[]): void;
    parseSource(source: IGenericObjectVO): void;
    getItem(id: string, isNeedToCreate?: boolean): ItemType;
    protected removeItem(id: string): void;
    get itemsCount(): number;
    protected createEmpty(id: string): ItemType;
    protected updateItem(item: ItemType, source: any): void;
    getAllItems(): ItemType[];
}
