import {Howl, Howler} from "howler";

import {AbstractSoundsManager} from "../../index";

export class HowlerSoundsManager extends AbstractSoundsManager {
    protected internalSetVolume(value: number): void {
        Howler.volume(value);
    }
}

// TODO: change when more adapters are supported,
// probably builds of the flibs should be separated per adapter
export class SoundsManager extends HowlerSoundsManager {
}