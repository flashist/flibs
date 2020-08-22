import {BaseObject} from "fcore";

import {Howl} from "howler";
import {TweenLite} from "gsap";

import {ISoundConfig} from "./ISoundConfig";
import {IPlaySoundConfig} from "./IPlaySoundConfig";

export abstract class AbstractSound extends BaseObject {

    protected config: ISoundConfig;
    private _tweenVolumeValue: number;

    constructor(config: ISoundConfig) {
        super(config);
    }

    protected construction(config: ISoundConfig): void {
        super.construction();

        this.config = config;
    }

    abstract play(config?: IPlaySoundConfig): void;
    abstract stop(): void;
    abstract getVolume(): number;

    public setVolume(value: number): void {
        TweenLite.killTweensOf(this);
        this.internalSetVolume(value);
    }
    protected abstract internalSetVolume(value: number): void;

    public tweenVolume(volume: number, time: number, onComplete?: Function): void {
        this.tweenVolumeValue = this.getVolume();

        TweenLite.killTweensOf(this);
        TweenLite.to(
            this,
            time,
            {
                tweenVolumeValue: volume,

                onComplete: () => {
                    if (onComplete) {
                        onComplete();
                    }
                }
            }
        );
    }

    protected get tweenVolumeValue(): number {
        return this._tweenVolumeValue;
    }
    protected set tweenVolumeValue(value: number) {
        if (value === this._tweenVolumeValue) {
            return;
        }

        this._tweenVolumeValue = value;
        this.internalSetVolume(this._tweenVolumeValue);
    }

    /*public getLoadingStatus(): LoadStatus {
        let result: LoadStatus = LoadStatus.WAIT;
        switch (this.engineSound.state()) {
            case "loading":
                result = LoadStatus.LOADING;
                break;
            case "loaded":
                result = LoadStatus.COMPLETE;
                break;
        }

        return result;
    }*/
}