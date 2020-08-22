import {AbstractLoadItem} from "./AbstractLoadItem";
import {AbstractSound} from "../../../sounds/abstract/AbstractSound";

export abstract class AbstractSoundLoadItem extends AbstractLoadItem {
    public sound: AbstractSound;
}