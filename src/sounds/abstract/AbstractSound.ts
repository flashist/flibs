import { BaseObject, Lock } from "@flashist/fcore";

import { Howl } from "howler";
import { TweenLite } from "gsap";

import { ISoundConfig } from "./ISoundConfig";
import { IPlaySoundConfig } from "./IPlaySoundConfig";

export abstract class AbstractSound extends BaseObject {

    protected config: ISoundConfig;
    private _tweenVolumeValue: number;

    protected mutedLock: Lock;
    protected _muted: boolean;

    constructor(config: ISoundConfig) {
        super(config);
    }

    protected construction(config: ISoundConfig): void {
        super.construction();

        this.mutedLock = new Lock();

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

    protected calculateMuted(): void {
        const prevMuted: boolean = this.muted;

        const newMuted: boolean = this.mutedLock.enabled;
        if (newMuted !== prevMuted) {
            this._muted = newMuted;
        }

        this.commitData();
    }

    public addMutedLock(locker: any): void {
        this.mutedLock.add(locker);

        this.calculateMuted();
    }

    public removeMutedLock(locker: any): void {
        this.mutedLock.remove(locker);

        this.calculateMuted();
    }

    public get muted(): boolean {
        return this._muted;
    }
}