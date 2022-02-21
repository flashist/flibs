import {Howler} from "howler";

import {AbstractSoundsManager} from "../../index";

export class HowlerSoundsManager extends AbstractSoundsManager {
    protected internalSetVolume(value: number): void {
        Howler.volume(value);
    }
}