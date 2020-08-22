import { BaseEventDispatcher } from "@flashist/fcore";
import { IGenericObjectVO } from "../..";
export declare class BaseDataVO extends BaseEventDispatcher implements IGenericObjectVO {
    type: string;
    id: string;
    update(source: Partial<this>): void;
}
