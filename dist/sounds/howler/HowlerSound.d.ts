import { Howl } from "howler";
import { AbstractSound } from "../abstract/AbstractSound";
import { IHowlerSoundConfig } from "./IHowlerSoundConfig";
import { IPlaySoundConfig } from "../abstract/IPlaySoundConfig";
export declare class HowlerSound extends AbstractSound {
    protected config: IHowlerSoundConfig;
    engineSound: Howl;
    constructor(config: IHowlerSoundConfig);
    protected construction(config: IHowlerSoundConfig): void;
    destruction(): void;
    getVolume(): number;
    protected internalSetVolume(value: number): void;
    play(config?: IPlaySoundConfig): void;
    stop(): void;
}
