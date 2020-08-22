import { BaseObject } from "@flashist/fcore";
import { ISoundConfig } from "./ISoundConfig";
import { IPlaySoundConfig } from "./IPlaySoundConfig";
export declare abstract class AbstractSound extends BaseObject {
    protected config: ISoundConfig;
    private _tweenVolumeValue;
    constructor(config: ISoundConfig);
    protected construction(config: ISoundConfig): void;
    abstract play(config?: IPlaySoundConfig): void;
    abstract stop(): void;
    abstract getVolume(): number;
    setVolume(value: number): void;
    protected abstract internalSetVolume(value: number): void;
    tweenVolume(volume: number, time: number, onComplete?: Function): void;
    protected get tweenVolumeValue(): number;
    protected set tweenVolumeValue(value: number);
}
