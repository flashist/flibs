import {GenericObjectChangeActionType} from "./GenericObjectChangeActionType";

export interface IGenericObjectVO {
    id?: string;
    type?: string;

    action?: GenericObjectChangeActionType;
    update?:(source:any) => void;
}