import { HowlerSound } from "../../../sounds/howler/HowlerSound";
import { AbstractSoundLoadItem } from "../../abstract/item/AbstractSoundLoadItem";
import { SoundsManager } from "../../../index";
export declare class HowlerSoundLoadItem extends AbstractSoundLoadItem {
    protected soundsManager: SoundsManager;
    sound: HowlerSound;
    protected internalPrepare(): void;
    protected internalStart(): void;
    protected internalStop(): void;
    protected addLoadingListeners(): void;
    protected removeLoadingListeners(): void;
    protected processLoadingComplete(data: any): void;
}
