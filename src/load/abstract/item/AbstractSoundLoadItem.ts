import {AbstractLoadItem} from "./AbstractLoadItem";
import {AbstractSound} from "../../../sounds/abstract/AbstractSound";

export abstract class AbstractSoundLoadItem<DataType extends object = object> extends AbstractLoadItem<DataType> {
    public sound: AbstractSound;
}