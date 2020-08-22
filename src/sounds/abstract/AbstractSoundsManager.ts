import {Lock, AssociativeArray, BaseObject} from "@flashist/fcore";

import {TweenLite} from "gsap";

import {Sound} from "../../index";
import {SoundsManagerEvent} from "./SoundsManagerEvent";

export abstract class AbstractSoundsManager extends BaseObject {

    protected soundsToIdMap: AssociativeArray<Sound> = new AssociativeArray<Sound>();

    protected disableLock: Lock = new Lock();
    private _isMuted: boolean = false;
    private _enabled: boolean = true;

    private _tweenVolumeValue: number;

    public defaultTweenTime: number = 0.5;

    protected volume: number = 1;

    protected construction(...args): void {
        super.construction(...args);

        this.disableLock = new Lock();

        this.setVolume(this.volume);
    }

    public registerSound(id: string, sound: Sound): void {
        this.soundsToIdMap.push(sound, id);
    }

    public getSound(id: string): Sound {
        return this.soundsToIdMap.getItem(id);
    }

    public addDisableLock(locker: any): void {
        this.disableLock.lock(locker);

        this.calculateEnabled();
    }

    public removeDisableLock(locker: any): void {
        this.disableLock.unlock(locker);

        this.calculateEnabled();
    }


    public get isMuted(): boolean {
        return this._isMuted;
    }

    public set isMuted(value: boolean) {
        if (value === this._isMuted) {
            return;
        }

        this._isMuted = value;
        this.dispatchEvent(SoundsManagerEvent.IS_MUTED_CHANGE);

        this.calculateEnabled();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    protected calculateEnabled(): void {
        const prevEnabled: boolean = this.enabled;

        const newEnabled: boolean = !this.disableLock.isLocked && !this.isMuted;
        this._enabled = newEnabled;

        if (this.enabled !== prevEnabled) {
            this.dispatchEvent(SoundsManagerEvent.ENABLED_CHANGE);
        }

        this.commitData();
    }

    protected commitData(): void {
        super.commitData();

        let newVolume: number = 0;
        if (this.enabled) {
            newVolume = this.getVolume();
        }
        // this.internalSetVolume(newVolume);
        this.internalSetVolume(newVolume)
    }

    public getVolume(): number {
        return this.volume;
    }

    public setVolume(value: number): void {
        TweenLite.killTweensOf(this);
        this.volume = value;

        this.dispatchEvent(SoundsManagerEvent.VOLUME_CHANGE);

        this.commitData();
    }
    protected abstract internalSetVolume(value: number): void;

    public tweenVolume(volume: number, time?: number, onComplete?: Function): void {
        if (!time && time !== 0) {
            time = this.defaultTweenTime;
        }

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
        this.setVolume(this._tweenVolumeValue);
    }

}